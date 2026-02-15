const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const Course = require('../models/Course');
const Document = require('../models/Document');
const OpenAI = require('openai');
const auth = require('../middleware/auth');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = 'gpt-4o-mini';

// Helper: process @MasonBot mention in channel messages
async function processBotMention(channelId, userMessage, io) {
  try {
    // Find which course owns this channel
    const course = await Course.findOne({ 'channels._id': channelId });
    if (!course) return;

    // Extract question (remove @MasonBot prefix)
    const question = userMessage.replace(/@masonbot/gi, '').trim();
    if (!question) return;

    // Build course context
    const docs = await Document.find({ courseId: course._id.toString() }).lean();
    let docContext = docs.map(d =>
      `- "${d.title}" (${d.fileType}): ${d.description || 'No description'}`
    ).join('\n');

    const courseInfo = `${course.code}: ${course.name} | Instructor: ${course.instructor} | Schedule: ${course.schedule} | Location: ${course.location}`;

    const systemPrompt = `You are MasonBot, a helpful AI assistant for the course ${course.code} - ${course.name} at George Mason University.

Course details: ${courseInfo}

Documents for this course:
${docContext || 'No documents uploaded yet.'}

A student asked a question in the class channel. Answer helpfully, concisely, and in context of this course. Keep response under 300 words.`;

    // Retry with backoff
    let reply;
    let lastErr;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const completion = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question },
          ],
          max_tokens: 512,
        });
        reply = completion.choices[0].message.content;
        break;
      } catch (err) {
        lastErr = err;
        if (err.status === 429 && attempt < 2) {
          const backoff = Math.pow(2, attempt) * 2000 + Math.random() * 1000;
          await new Promise(r => setTimeout(r, backoff));
        } else {
          throw err;
        }
      }
    }

    if (!reply && lastErr && lastErr.status === 429) {
      const botMsg = new Message({
        senderId: 'masonbot',
        senderName: 'MasonBot',
        senderAvatar: '🤖',
        content: 'I am a bit busy right now. Please try again in a minute.',
        channelId: channelId,
      });
      await botMsg.save();
      io.to(`channel:${channelId}`).emit('new-channel-message', botMsg.toJSON());
      return;
    }

    if (!reply) return;

    // Save bot message
    const botMsg = new Message({
      senderId: 'masonbot',
      senderName: 'MasonBot',
      senderAvatar: '🤖',
      content: reply,
      channelId: channelId,
    });
    await botMsg.save();

    // Emit bot reply
    io.to(`channel:${channelId}`).emit('new-channel-message', botMsg.toJSON());
  } catch (err) {
    console.error('MasonBot mention error:', err);
  }
}

// GET /api/messages/channel/:channelId - Get channel messages
router.get('/channel/:channelId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ channelId: req.params.channelId })
      .sort({ createdAt: 1 })
      .limit(200);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/messages/channel/:channelId - Send channel message
router.post('/channel/:channelId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const message = new Message({
      senderId: user._id.toString(),
      senderName: user.name,
      senderAvatar: user.avatarUrl,
      content: req.body.content || '',
      channelId: req.params.channelId,
      fileUrl: req.body.fileUrl || null,
      fileName: req.body.fileName || null,
      fileType: req.body.fileType || null,
    });
    await message.save();

    // Emit to channel room for real-time updates
    const io = req.app.get('io');
    io.to(`channel:${req.params.channelId}`).emit('new-channel-message', message.toJSON());

    // Check for @MasonBot mention and process asynchronously
    const content = req.body.content || '';
    if (content.toLowerCase().includes('@masonbot')) {
      processBotMention(req.params.channelId, content, io).catch(console.error);
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/messages/dm/:partnerId - Get DM messages with a partner
router.get('/dm/:partnerId', auth, async (req, res) => {
  try {
    const myId = req.userId;
    const partnerId = req.params.partnerId;

    const messages = await Message.find({
      dmParticipants: { $all: [myId, partnerId] },
    }).sort({ createdAt: 1 }).limit(200);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/messages/dm/:partnerId - Send DM
router.post('/dm/:partnerId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const partnerId = req.params.partnerId;
    const message = new Message({
      senderId: user._id.toString(),
      senderName: user.name,
      senderAvatar: user.avatarUrl,
      content: req.body.content || '',
      dmPartnerId: partnerId,
      fileUrl: req.body.fileUrl || null,
      fileName: req.body.fileName || null,
      fileType: req.body.fileType || null,
      dmParticipants: [user._id.toString(), partnerId].sort(),
    });
    await message.save();

    // Emit to partner's personal room for real-time DM delivery
    const io = req.app.get('io');
    io.to(`user:${partnerId}`).emit('new-dm', message.toJSON());

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/messages/dm-conversations - Get list of DM conversation partners
router.get('/dm-conversations', auth, async (req, res) => {
  try {
    const myId = req.userId;

    // Find all distinct DM partners
    const messages = await Message.aggregate([
      { $match: { dmParticipants: myId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: [{ $arrayElemAt: ['$dmParticipants', 0] }, myId] },
              { $arrayElemAt: ['$dmParticipants', 1] },
              { $arrayElemAt: ['$dmParticipants', 0] },
            ]
          },
          lastMessage: { $first: '$$ROOT' },
        }
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    // Get partner user info
    const conversations = [];
    for (const msg of messages) {
      const partnerId = msg._id;
      const partner = await User.findById(partnerId);
      if (partner) {
        conversations.push({
          partnerId: partnerId,
          partnerName: partner.name,
          partnerAvatar: partner.avatarUrl,
          partnerMajor: partner.major,
          lastMessage: msg.lastMessage.content,
          lastMessageTime: msg.lastMessage.createdAt,
          lastMessageSenderId: msg.lastMessage.senderId,
        });
      }
    }

    res.json(conversations);
  } catch (err) {
    console.error('DM conversations error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
