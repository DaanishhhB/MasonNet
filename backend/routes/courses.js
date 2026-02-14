const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/courses - Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/courses/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/courses/:id/enroll - Enroll in a course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const courseId = course._id.toString();
    const userId = user._id.toString();

    // Add to course enrolled list
    if (!course.enrolledStudentIds.includes(userId)) {
      course.enrolledStudentIds.push(userId);
      await course.save();
    }

    // Add to user enrolled list
    if (!user.enrolledCourseIds.includes(courseId)) {
      user.enrolledCourseIds.push(courseId);
      await user.save();
    }

    res.json({ message: 'Enrolled successfully', course, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/courses/:id/unenroll - Unenroll from a course
router.post('/:id/unenroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const courseId = course._id.toString();
    const userId = user._id.toString();

    course.enrolledStudentIds = course.enrolledStudentIds.filter(id => id !== userId);
    await course.save();

    user.enrolledCourseIds = user.enrolledCourseIds.filter(id => id !== courseId);
    await user.save();

    res.json({ message: 'Unenrolled successfully', course, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/courses/:id/students - Get enrolled students
router.get('/:id/students', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const students = await User.find({ _id: { $in: course.enrolledStudentIds } });
    res.json(students.map(s => s.toPublicJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
