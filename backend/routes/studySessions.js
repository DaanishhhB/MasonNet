const express = require('express');
const StudySession = require('../models/StudySession');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/study-sessions/course/:courseId
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const sessions = await StudySession.find({ courseId: req.params.courseId }).sort({ dateTime: 1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/study-sessions/my-sessions
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const sessions = await StudySession.find({
      $or: [
        { organizerId: req.userId },
        { attendingIds: req.userId },
      ]
    }).sort({ dateTime: 1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/study-sessions - Create a study session
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { courseId, title, description, location, dateTime, duration } = req.body;
    const session = new StudySession({
      courseId,
      organizerId: user._id.toString(),
      organizerName: user.name,
      title,
      description,
      location,
      dateTime,
      duration: duration || 60,
      attendingIds: [user._id.toString()],
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/study-sessions/:id/rsvp - Toggle RSVP
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const userId = req.userId;
    const { status } = req.body; // 'attending', 'not_attending', 'none'

    // Remove from both lists first
    session.attendingIds = session.attendingIds.filter(id => id !== userId);
    session.notAttendingIds = session.notAttendingIds.filter(id => id !== userId);

    if (status === 'attending') {
      session.attendingIds.push(userId);
    } else if (status === 'not_attending') {
      session.notAttendingIds.push(userId);
    }

    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
