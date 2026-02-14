const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId:     { type: String, required: true },
  authorName:   { type: String, required: true },
  authorAvatar: { type: String, default: '' },
  authorMajor:  { type: String, default: '' },
  content:      { type: String, required: true },
  likes:        { type: Number, default: 0 },
  likedBy:      [{ type: String }],   // user IDs who liked
  comments:     { type: Number, default: 0 },
  reposts:      { type: Number, default: 0 },
}, { timestamps: true });

postSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  obj.timestamp = obj.createdAt;
  delete obj._id;
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
