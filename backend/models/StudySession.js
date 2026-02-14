const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  courseId:       { type: String, required: true },
  organizerId:   { type: String, required: true },
  organizerName: { type: String, required: true },
  title:         { type: String, required: true },
  description:   { type: String, default: '' },
  location:      { type: String, default: '' },
  dateTime:      { type: Date, required: true },
  duration:      { type: Number, default: 60 }, // minutes
  attendingIds:     [{ type: String }],
  notAttendingIds:  [{ type: String }],
}, { timestamps: true });

studySessionSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

studySessionSchema.index({ courseId: 1 });

module.exports = mongoose.model('StudySession', studySessionSchema);
