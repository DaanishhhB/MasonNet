const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Document = require('../models/Document');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/chatbot - Send a message to the chatbot
router.post('/', auth, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Pull all documents from the database for context
    const documents = await Document.find({}).lean();
    const courses = await Course.find({}).lean();

    // Build context from documents
    let docContext = '';
    if (documents.length > 0) {
      docContext = documents.map(d => {
        const course = courses.find(c => c._id.toString() === d.courseId);
        const courseName = course ? `${course.code} - ${course.name}` : d.courseId;
        return `- "${d.title}" (${d.fileType}, ${d.fileSize}) for ${courseName}: ${d.description || 'No description'}. Semester: ${d.semester}. Uploaded by: ${d.uploaderName}. Downloads: ${d.downloads}.`;
      }).join('\n');
    }

    // Build course context
    let courseContext = '';
    if (courses.length > 0) {
      courseContext = courses.map(c => {
        const channelList = c.channels ? c.channels.map(ch => ch.name).join(', ') : '';
        return `- ${c.code}: ${c.name} | Instructor: ${c.instructor} | Schedule: ${c.schedule} | Location: ${c.location} | Credits: ${c.credits} | Channels: ${channelList}`;
      }).join('\n');
    }

    const systemPrompt = `You are MasonBot, a helpful AI assistant for MasonNet, a university platform for George Mason University students. You help students with questions about their courses, documents, and study materials.

Here are the available courses:
${courseContext || 'No courses available.'}

Here are the documents and files uploaded to the platform:
${docContext || 'No documents uploaded yet.'}

Use this information to answer student questions about their courses, available study materials, documents, and general academic help. Be friendly, concise, and helpful. If a student asks about something not in the data, you can still help with general academic advice.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build chat history
    const chatHistory = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        chatHistory.push({
          role: h.role === 'bot' ? 'model' : 'user',
          parts: [{ text: h.content }],
        });
      }
    }

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood! I\'m MasonBot, ready to help GMU students with their courses and documents. How can I help you?' }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ error: 'Failed to get response from chatbot' });
  }
});

module.exports = router;
