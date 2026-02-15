const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: '💬' },
  createdBy: { type: String, default: null }, // null = default/main channel, otherwise user name
});

const courseSchema = new mongoose.Schema({
  code:        { type: String, required: true },
  name:        { type: String, required: true },
  instructor:  { type: String, required: true },
  schedule:    { type: String, required: true },
  location:    { type: String, required: true },
  credits:     { type: Number, default: 3 },
  description: { type: String, default: '' },
  enrolledStudentIds: [{ type: String }],
  channels: [channelSchema],
}, { timestamps: true });

courseSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  if (obj.channels) {
    obj.channels = obj.channels.map(ch => ({
      id: ch._id.toString(),
      name: ch.name,
      icon: ch.icon,
      createdBy: ch.createdBy || null,
    }));
  }
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Course', courseSchema);
