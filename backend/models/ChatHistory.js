const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'bot'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, default: null }, // null = general chat, set = course-specific
  messages: [chatMessageSchema],
}, { timestamps: true });

chatHistorySchema.index({ userId: 1, courseId: 1 }, { unique: true });

chatHistorySchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
