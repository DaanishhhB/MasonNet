const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/posts - Get all posts (newest first)
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    // Add isLiked for the requesting user
    const postsWithLiked = posts.map(p => {
      const obj = p.toJSON();
      obj.isLiked = (p.likedBy || []).includes(req.userId);
      return obj;
    });
    res.json(postsWithLiked);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/posts - Create a post
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const post = new Post({
      authorId: user._id.toString(),
      authorName: user.name,
      authorAvatar: user.avatarUrl,
      authorMajor: user.major,
      content: req.body.content,
    });
    await post.save();

    const obj = post.toJSON();
    obj.isLiked = false;

    // Emit to feed room for real-time updates
    const io = req.app.get('io');
    io.to('feed').emit('new-post', obj);

    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/posts/:id/like - Toggle like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.userId;
    const index = post.likedBy.indexOf(userId);

    if (index === -1) {
      post.likedBy.push(userId);
      post.likes += 1;
    } else {
      post.likedBy.splice(index, 1);
      post.likes -= 1;
    }

    await post.save();

    const obj = post.toJSON();
    obj.isLiked = post.likedBy.includes(userId);

    // Emit like update to feed room
    const io = req.app.get('io');
    io.to('feed').emit('post-updated', obj);

    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/posts/user/:userId - Get posts by a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.userId }).sort({ createdAt: -1 });
    const postsWithLiked = posts.map(p => {
      const obj = p.toJSON();
      obj.isLiked = (p.likedBy || []).includes(req.userId);
      return obj;
    });
    res.json(postsWithLiked);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
