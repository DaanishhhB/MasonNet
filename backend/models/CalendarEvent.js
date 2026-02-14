const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  courseId:    { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  date:        { type: Date, required: true },
  type:        { type: String, enum: ['homework', 'quiz', 'exam', 'project', 'other'], default: 'other' },
  createdBy:   { type: String },
}, { timestamps: true });

calendarEventSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

calendarEventSchema.index({ courseId: 1, date: 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
