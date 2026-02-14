const express = require('express');
const CalendarEvent = require('../models/CalendarEvent');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/events/course/:courseId
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const events = await CalendarEvent.find({ courseId: req.params.courseId }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/events/my-events - Get events for all enrolled courses
router.get('/my-events', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const events = await CalendarEvent.find({
      courseId: { $in: user.enrolledCourseIds }
    }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/events - Create an event
router.post('/', auth, async (req, res) => {
  try {
    const { courseId, title, description, date, type } = req.body;
    const event = new CalendarEvent({
      courseId,
      title,
      description,
      date,
      type: type || 'other',
      createdBy: req.userId,
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
