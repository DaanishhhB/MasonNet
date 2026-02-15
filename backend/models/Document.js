const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  courseId:      { type: String, required: true },
  uploaderId:   { type: String, required: true },
  uploaderName: { type: String, required: true },
  title:        { type: String, required: true },
  description:  { type: String, default: '' },
  fileType:     { type: String, default: 'PDF' },
  fileSize:     { type: String, default: '0 KB' },
  mimeType:     { type: String, default: 'application/octet-stream' },
  fileData:     { type: String, default: null }, // base64 encoded file content
  extractedText: { type: String, default: '' }, // text extracted from PDFs for chatbot RAG
  isPreviousSemester: { type: Boolean, default: false },
  semester:     { type: String, default: 'Spring 2026' },
  downloads:    { type: Number, default: 0 },
}, { timestamps: true });

documentSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  obj.uploadDate = obj.createdAt;
  delete obj._id;
  delete obj.__v;
  return obj;
};

documentSchema.index({ courseId: 1 });

module.exports = mongoose.model('Document', documentSchema);
