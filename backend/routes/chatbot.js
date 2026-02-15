const express = require('express');
const OpenAI = require('openai');
const Document = require('../models/Document');
const Course = require('../models/Course');
const ChatHistory = require('../models/ChatHistory');
const CalendarEvent = require('../models/CalendarEvent');
const StudySession = require('../models/StudySession');
const MasonMeet = require('../models/MasonMeet');
const Post = require('../models/Post');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL = 'o4-mini';

// Retry helper for rate-limited OpenAI API calls
async function chatWithRetry(messages, maxRetries = 3) {
  let lastErr;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages,
        max_tokens: 1024,
      });
      return completion.choices[0].message.content;
    } catch (err) {
      lastErr = err;
      if (err.status === 429 && attempt < maxRetries - 1) {
        const backoff = Math.pow(2, attempt) * 2000 + Math.random() * 1000;
        console.log(`Rate limited. Retrying in ${Math.round(backoff)}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, backoff));
      } else {
        throw err;
      }
    }
  }
  throw lastErr;
}

// Helper to build context strings with full system awareness
async function buildContext(courseFilter = null, userId = null) {
  const query = courseFilter ? { _id: courseFilter } : {};
  const docQuery = courseFilter ? { courseId: courseFilter } : {};

  // Fetch all relevant data in parallel
  const [documents, courses, events, studySessions, masonMeets, recentPosts, currentUser] = await Promise.all([
    Document.find(docQuery).select('-fileData').lean(),
    Course.find(query).lean(),
    CalendarEvent.find(courseFilter ? { courseId: courseFilter } : {}).sort({ date: 1 }).lean(),
    StudySession.find(courseFilter ? { courseId: courseFilter } : {}).sort({ dateTime: 1 }).lean(),
    courseFilter ? Promise.resolve([]) : MasonMeet.find({}).sort({ dateTime: 1 }).limit(30).lean(),
    courseFilter ? Promise.resolve([]) : Post.find({}).sort({ createdAt: -1 }).limit(20).lean(),
    userId ? User.findById(userId).lean() : Promise.resolve(null),
  ]);

  // Document context with extracted text content
  let docContext = '';
  if (documents.length > 0) {
    docContext = documents.map(d => {
      const course = courses.find(c => c._id.toString() === d.courseId);
      const courseName = course ? `${course.code} - ${course.name}` : d.courseId;
      let entry = `- "${d.title}" (${d.fileType}, ${d.fileSize}) for ${courseName}: ${d.description || 'No description'}. Semester: ${d.semester}. Uploaded by: ${d.uploaderName}. Downloads: ${d.downloads}.`;
      // Include extracted text content for RAG (truncate to 2000 chars per doc to fit context)
      if (d.extractedText) {
        const excerpt = d.extractedText.length > 2000 ? d.extractedText.substring(0, 2000) + '...' : d.extractedText;
        entry += `\n  Content: ${excerpt}`;
      }
      return entry;
    }).join('\n');
  }

  // Course context
  let courseContext = '';
  if (courses.length > 0) {
    courseContext = courses.map(c => {
      const channelList = c.channels ? c.channels.map(ch => ch.name).join(', ') : '';
      const enrolledCount = c.enrolledStudentIds ? c.enrolledStudentIds.length : 0;
      return `- ${c.code}: ${c.name} | Instructor: ${c.instructor} | Schedule: ${c.schedule} | Location: ${c.location} | Credits: ${c.credits} | Enrolled: ${enrolledCount} students | Channels: ${channelList} | Description: ${c.description}`;
    }).join('\n');
  }

  // Calendar events context
  let eventContext = '';
  if (events.length > 0) {
    eventContext = events.map(e => {
      const course = courses.find(c => c._id.toString() === e.courseId);
      const courseName = course ? course.code : e.courseId;
      const dateStr = new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      return `- [${e.type.toUpperCase()}] ${courseName}: "${e.title}" - ${e.description} (Due: ${dateStr})`;
    }).join('\n');
  }

  // Study sessions context
  let studyContext = '';
  if (studySessions.length > 0) {
    studyContext = studySessions.map(s => {
      const course = courses.find(c => c._id.toString() === s.courseId);
      const courseName = course ? course.code : s.courseId;
      const dateStr = new Date(s.dateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      return `- ${courseName}: "${s.title}" by ${s.organizerName} | ${s.description} | Location: ${s.location} | When: ${dateStr} | Duration: ${s.duration}min | Attending: ${s.attendingIds.length} students`;
    }).join('\n');
  }

  // MasonMeets context (social/club/sports)
  let meetContext = '';
  if (masonMeets.length > 0) {
    meetContext = masonMeets.map(m => {
      const dateStr = new Date(m.dateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      return `- [${m.category}] "${m.title}" by ${m.organizerName} | ${m.description} | Location: ${m.location} | When: ${dateStr} | Duration: ${m.duration}min | Attending: ${m.attendingIds.length}${m.maxAttendees ? '/' + m.maxAttendees : ''}`;
    }).join('\n');
  }

  // Recent feed posts context
  let postContext = '';
  if (recentPosts.length > 0) {
    postContext = recentPosts.map(p => {
      return `- ${p.authorName} (${p.authorMajor}): "${p.content}" [${p.likes} likes]`;
    }).join('\n');
  }

  // Current user context
  let userContext = '';
  if (currentUser) {
    userContext = `Current user: ${currentUser.name} | Major: ${currentUser.major} | Year: ${currentUser.year} | Bio: ${currentUser.bio || 'N/A'} | Enrolled courses: ${(currentUser.enrolledCourseIds || []).length}`;
  }

  return { docContext, courseContext, eventContext, studyContext, meetContext, postContext, userContext, courses };
}

// POST /api/chatbot - Send a message to the chatbot (general)
router.post('/', auth, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const { docContext, courseContext, eventContext, studyContext, meetContext, postContext, userContext } = await buildContext(null, req.userId);

    const systemPrompt = `You are MasonBot, a helpful AI assistant for MasonNet, a university platform for George Mason University students. You have comprehensive knowledge about all aspects of the platform and campus life.

${userContext ? `CURRENT USER:\n${userContext}\n` : ''}
COURSES ON THE PLATFORM:
${courseContext || 'No courses available.'}

DOCUMENTS AND STUDY MATERIALS (with content when available):
${docContext || 'No documents uploaded yet.'}

UPCOMING ASSIGNMENTS, QUIZZES & EXAMS:
${eventContext || 'No upcoming events.'}

STUDY SESSIONS:
${studyContext || 'No study sessions scheduled.'}

CAMPUS MEETUPS & EVENTS (MasonMeets):
${meetContext || 'No meetups scheduled.'}

RECENT COMMUNITY POSTS:
${postContext || 'No recent posts.'}

Use ALL of this information to answer student questions comprehensively. You can help with:
- Course content, assignments, deadlines, and study materials
- Document content (you can reference and explain what documents contain)
- Upcoming events, exams, and their dates
- Study session recommendations and scheduling
- Campus social events and meetups
- General academic advice and campus life at George Mason University
Be friendly, concise, and helpful. Reference specific data points when answering (e.g., exact dates, locations, document names).`;

    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    if (history && Array.isArray(history)) {
      for (const h of history) {
        messages.push({
          role: h.role === 'bot' ? 'assistant' : 'user',
          content: h.content,
        });
      }
    }

    messages.push({ role: 'user', content: message });

    const reply = await chatWithRetry(messages);

    // Persist chat history
    await ChatHistory.findOneAndUpdate(
      { userId: req.userId, courseId: null },
      {
        $push: {
          messages: {
            $each: [
              { role: 'user', content: message },
              { role: 'bot', content: reply },
            ],
          },
        },
      },
      { upsert: true, new: true }
    );

    res.json({ reply });
  } catch (err) {
    console.error('Chatbot error:', err);
    if (err.status === 429) {
      res.status(429).json({ error: 'MasonBot is busy right now. Please try again in a moment.' });
    } else {
      res.status(500).json({ error: 'Failed to get response from chatbot' });
    }
  }
});

// POST /api/chatbot/course/:courseId - Course-specific chatbot
router.post('/course/:courseId', auth, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const courseId = req.params.courseId;
    const { docContext, courseContext, eventContext, studyContext, courses } = await buildContext(courseId, req.userId);
    const course = courses[0];
    const courseName = course ? `${course.code} - ${course.name}` : 'this course';

    const systemPrompt = `You are MasonBot, a helpful AI assistant for MasonNet, a university platform for George Mason University students. You are currently helping a student in the context of the course: ${courseName}.

COURSE DETAILS:
${courseContext || 'No course details available.'}

DOCUMENTS & STUDY MATERIALS FOR THIS COURSE (with content when available):
${docContext || 'No documents uploaded yet for this course.'}

UPCOMING ASSIGNMENTS, QUIZZES & EXAMS FOR THIS COURSE:
${eventContext || 'No upcoming events for this course.'}

STUDY SESSIONS FOR THIS COURSE:
${studyContext || 'No study sessions scheduled for this course.'}

Focus your answers on this specific course. You have access to the actual content of uploaded documents, so you can answer detailed questions about course material, explain concepts from lecture notes, and reference specific sections of study guides.

Help with course material, assignments, deadlines, study tips, exam preparation, and any questions related to ${courseName}. When students ask about document content, use the extracted text to provide accurate answers. Be friendly, concise, and helpful.`;

    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    if (history && Array.isArray(history)) {
      for (const h of history) {
        messages.push({
          role: h.role === 'bot' ? 'assistant' : 'user',
          content: h.content,
        });
      }
    }

    messages.push({ role: 'user', content: message });

    const reply = await chatWithRetry(messages);

    // Persist chat history
    await ChatHistory.findOneAndUpdate(
      { userId: req.userId, courseId },
      {
        $push: {
          messages: {
            $each: [
              { role: 'user', content: message },
              { role: 'bot', content: reply },
            ],
          },
        },
      },
      { upsert: true, new: true }
    );

    res.json({ reply });
  } catch (err) {
    console.error('Course chatbot error:', err);
    if (err.status === 429) {
      res.status(429).json({ error: 'MasonBot is busy right now. Please try again in a moment.' });
    } else {
      res.status(500).json({ error: 'Failed to get response from chatbot' });
    }
  }
});

// GET /api/chatbot/history - Get general chat history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await ChatHistory.findOne({ userId: req.userId, courseId: null });
    res.json({ messages: history ? history.messages : [] });
  } catch (err) {
    console.error('Get chat history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/chatbot/history/:courseId - Get course-specific chat history
router.get('/history/:courseId', auth, async (req, res) => {
  try {
    const history = await ChatHistory.findOne({ userId: req.userId, courseId: req.params.courseId });
    res.json({ messages: history ? history.messages : [] });
  } catch (err) {
    console.error('Get course chat history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/chatbot/history - Reset general chat history
router.delete('/history', auth, async (req, res) => {
  try {
    await ChatHistory.deleteOne({ userId: req.userId, courseId: null });
    res.json({ success: true });
  } catch (err) {
    console.error('Reset chat history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/chatbot/history/:courseId - Reset course-specific chat history
router.delete('/history/:courseId', auth, async (req, res) => {
  try {
    await ChatHistory.deleteOne({ userId: req.userId, courseId: req.params.courseId });
    res.json({ success: true });
  } catch (err) {
    console.error('Reset course chat history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
