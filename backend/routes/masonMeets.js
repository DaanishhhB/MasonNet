const express = require('express');
const MasonMeet = require('../models/MasonMeet');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/mason-meets - Get all upcoming meetups
router.get('/', auth, async (req, res) => {
  try {
    const meets = await MasonMeet.find({ dateTime: { $gte: new Date() } })
      .sort({ dateTime: 1 })
      .limit(100);
    res.json(meets.map(m => m.toJSON()));
  } catch (err) {
    console.error('MasonMeets error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/mason-meets/all - Get all meetups including past
router.get('/all', auth, async (req, res) => {
  try {
    const meets = await MasonMeet.find()
      .sort({ dateTime: -1 })
      .limit(100);
    res.json(meets.map(m => m.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/mason-meets - Create a meetup
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { title, description, location, dateTime, duration, category, maxAttendees } = req.body;
    if (!title || !location || !dateTime) {
      return res.status(400).json({ error: 'Title, location, and dateTime are required' });
    }

    const meet = new MasonMeet({
      title,
      description: description || '',
      location,
      dateTime: new Date(dateTime),
      duration: duration || 60,
      organizerId: user._id.toString(),
      organizerName: user.name,
      category: category || 'General',
      maxAttendees: maxAttendees || 0,
      attendingIds: [user._id.toString()], // organizer auto-attends
    });

    await meet.save();
    res.status(201).json(meet.toJSON());
  } catch (err) {
    console.error('Create meetup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/mason-meets/:id/rsvp - RSVP to a meetup
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const meet = await MasonMeet.findById(req.params.id);
    if (!meet) return res.status(404).json({ error: 'Meetup not found' });

    const userId = req.userId;
    const { status } = req.body; // 'attending', 'not-attending', 'remove'

    // Remove from both lists first
    meet.attendingIds = meet.attendingIds.filter(id => id !== userId);
    meet.notAttendingIds = meet.notAttendingIds.filter(id => id !== userId);

    if (status === 'attending') {
      // Check max attendees
      if (meet.maxAttendees > 0 && meet.attendingIds.length >= meet.maxAttendees) {
        return res.status(400).json({ error: 'Meetup is full' });
      }
      meet.attendingIds.push(userId);
    } else if (status === 'not-attending') {
      meet.notAttendingIds.push(userId);
    }
    // 'remove' just removes from both lists (already done above)

    await meet.save();
    res.json(meet.toJSON());
  } catch (err) {
    console.error('RSVP error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/mason-meets/:id - Delete a meetup (organizer only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const meet = await MasonMeet.findById(req.params.id);
    if (!meet) return res.status(404).json({ error: 'Meetup not found' });

    if (meet.organizerId !== req.userId) {
      return res.status(403).json({ error: 'Only the organizer can delete this meetup' });
    }

    await MasonMeet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meetup deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
