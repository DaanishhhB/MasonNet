const express = require('express');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const Document = require('../models/Document');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const EXTRACT_MODEL = 'gpt-4o-mini';

// Helper: Extract raw text from base64-encoded PDF
async function extractRawTextFromPdf(base64Data) {
  try {
    const raw = base64Data.replace(/^data:application\/pdf;base64,/, '');
    const buffer = Buffer.from(raw, 'base64');
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (err) {
    console.error('PDF raw text extraction error:', err.message);
    return '';
  }
}

// Helper: Extract raw text from base64-encoded plain text files
function extractRawTextFromPlain(base64Data) {
  try {
    const raw = base64Data.replace(/^data:[^;]+;base64,/, '');
    return Buffer.from(raw, 'base64').toString('utf-8');
  } catch (err) {
    console.error('Text extraction error:', err.message);
    return '';
  }
}

// Use GPT o4-mini to create a structured knowledge summary from raw text
async function extractStructuredContent(rawText, title, description) {
  if (!rawText || rawText.trim().length < 20) return rawText || '';
  try {
    // Truncate input to avoid token limits
    const inputText = rawText.length > 30000 ? rawText.substring(0, 30000) : rawText;
    const completion = await openai.chat.completions.create({
      model: EXTRACT_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a document analysis assistant. Given the raw text extracted from an academic document, produce a structured knowledge summary that captures ALL key information, concepts, definitions, formulas, examples, and important details. The summary should be comprehensive enough that someone reading it can understand the full content of the document without seeing the original. Format it clearly with sections, bullet points, and key terms highlighted. Preserve any code snippets, formulas, or technical details exactly.`,
        },
        {
          role: 'user',
          content: `Document title: "${title}"\nDescription: "${description}"\n\nRaw extracted text:\n${inputText}`,
        },
      ],
      max_completion_tokens: 4096,
    });
    return completion.choices[0].message.content || rawText;
  } catch (err) {
    console.error('GPT extraction error:', err.message);
    // Fall back to raw text if GPT fails
    return rawText;
  }
}

// GET /api/documents/course/:courseId?previous=true/false
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const isPrevious = req.query.previous === 'true';
    // Exclude fileData and extractedText from list queries for performance
    const docs = await Document.find({
      courseId: req.params.courseId,
      isPreviousSemester: isPrevious,
    }).select('-fileData -extractedText').sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/documents - Upload document with file data
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { courseId, title, description, fileType, fileSize, mimeType, fileData, isPreviousSemester, semester } = req.body;

    // Extract text content from the file using GPT o4-mini for structured analysis
    let extractedText = '';
    if (fileData) {
      let rawText = '';
      const mime = (mimeType || '').toLowerCase();
      const ftype = (fileType || '').toUpperCase();
      if (mime === 'application/pdf' || ftype === 'PDF') {
        rawText = await extractRawTextFromPdf(fileData);
      } else if (mime.startsWith('text/') || ftype === 'TXT') {
        rawText = extractRawTextFromPlain(fileData);
      }
      // Use GPT to create a structured knowledge summary
      if (rawText && rawText.trim().length > 0) {
        extractedText = await extractStructuredContent(rawText, title, description);
      }
      // Truncate to 50K chars to avoid huge DB entries
      if (extractedText.length > 50000) {
        extractedText = extractedText.substring(0, 50000);
      }
    }

    const doc = new Document({
      courseId,
      uploaderId: user._id.toString(),
      uploaderName: user.name,
      title,
      description,
      fileType: fileType || 'PDF',
      fileSize: fileSize || '0 KB',
      mimeType: mimeType || 'application/octet-stream',
      fileData: fileData || null,
      extractedText,
      isPreviousSemester: isPreviousSemester || false,
      semester: semester || 'Spring 2026',
    });
    await doc.save();

    // Return without fileData for response
    const result = doc.toJSON();
    delete result.fileData;
    res.status(201).json(result);
  } catch (err) {
    console.error('Document upload error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/documents/:id/download - Get file data for download
router.get('/:id/download', auth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    // Increment download count
    doc.downloads += 1;
    await doc.save();

    if (!doc.fileData) {
      return res.status(404).json({ error: 'No file data available for this document' });
    }

    res.json({
      id: doc._id.toString(),
      title: doc.title,
      fileType: doc.fileType,
      mimeType: doc.mimeType,
      fileData: doc.fileData,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/documents/:id/increment-download - Just increment download count (legacy)
router.post('/:id/download', auth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    doc.downloads += 1;
    await doc.save();
    const result = doc.toJSON();
    delete result.fileData;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
