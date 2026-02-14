const express = require('express');
const Document = require('../models/Document');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/documents/course/:courseId?previous=true/false
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const isPrevious = req.query.previous === 'true';
    const docs = await Document.find({
      courseId: req.params.courseId,
      isPreviousSemester: isPrevious,
    }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/documents - Upload document metadata
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { courseId, title, description, fileType, fileSize, isPreviousSemester, semester } = req.body;
    const doc = new Document({
      courseId,
      uploaderId: user._id.toString(),
      uploaderName: user.name,
      title,
      description,
      fileType: fileType || 'PDF',
      fileSize: fileSize || '0 KB',
      isPreviousSemester: isPreviousSemester || false,
      semester: semester || 'Spring 2026',
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/documents/:id/download - Increment download count
router.post('/:id/download', auth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    doc.downloads += 1;
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
