const mongoose = require('mongoose');

const masonMeetSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  location:    { type: String, required: true },
  dateTime:    { type: Date, required: true },
  duration:    { type: Number, default: 60 }, // minutes
  organizerId:   { type: String, required: true },
  organizerName: { type: String, required: true },
  category:    { type: String, default: 'General' }, // General, Sports, Study, Social, Club, Other
  maxAttendees:  { type: Number, default: 0 }, // 0 = unlimited
  attendingIds:    [{ type: String }],
  notAttendingIds: [{ type: String }],
}, { timestamps: true });

masonMeetSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

masonMeetSchema.index({ dateTime: 1 });
masonMeetSchema.index({ organizerId: 1 });

module.exports = mongoose.model('MasonMeet', masonMeetSchema);
