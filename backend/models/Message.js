const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId:    { type: String, required: true },
  senderName:  { type: String, required: true },
  senderAvatar:{ type: String, default: '' },
  content:     { type: String, required: true },
  channelId:   { type: String, default: null },
  dmPartnerId: { type: String, default: null },
  // For DMs we store both participant IDs for querying
  dmParticipants: [{ type: String }],
}, { timestamps: true });

messageSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  obj.timestamp = obj.createdAt;
  delete obj._id;
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

// Index for efficient queries
messageSchema.index({ channelId: 1, createdAt: 1 });
messageSchema.index({ dmParticipants: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
