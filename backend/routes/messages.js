const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

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
      content: req.body.content,
      channelId: req.params.channelId,
    });
    await message.save();

    // Emit to channel room for real-time updates
    const io = req.app.get('io');
    io.to(`channel:${req.params.channelId}`).emit('new-channel-message', message.toJSON());

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
      content: req.body.content,
      dmPartnerId: partnerId,
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
