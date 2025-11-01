// ============================================
// Analyze Route - Medical Report Processing
// ============================================

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { convertPdfToImages, cleanupTempFiles } = require('../utils/pdf');
const { extractTextFromMultipleImages } = require('../utils/ocr');
const { analyzeMedicalReport } = require('../utils/analysis');

const router = express.Router();

// ============================================
// Multer Configuration for File Upload
// ============================================

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'medical-report-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter - only accept PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// ============================================
// POST /api/analyze - Main Analysis Endpoint
// ============================================

router.post('/analyze', upload.single('file'), async (req, res) => {
  let pdfPath = null;
  let imageDir = null;

  try {
    console.log('\n🏥 ======================================');
    console.log('   New Medical Report Analysis Request');
    console.log('🏥 ======================================\n');

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please upload a PDF file.'
      });
    }

    pdfPath = req.file.path;
    console.log(`📁 File received: ${req.file.originalname}`);
    console.log(`📊 File size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`);

    // Step 1: Convert PDF to images
    imageDir = path.join(uploadsDir, `temp-${Date.now()}`);
    const imagePaths = await convertPdfToImages(pdfPath, imageDir);

    if (imagePaths.length === 0) {
      throw new Error('No pages could be extracted from the PDF');
    }

    // Step 2: Extract text using OCR
    console.log('\n🔤 Starting OCR text extraction...');
    const extractedText = await extractTextFromMultipleImages(imagePaths);

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF. The file may be an image-only PDF or empty.');
    }

    console.log(`✅ Extracted ${extractedText.length} characters`);

    // Step 3: Analyze medical report
    console.log('\n🔬 Analyzing medical report...');
    const analysis = analyzeMedicalReport(extractedText);

    // Step 4: Clean up temporary files
    console.log('\n🧹 Cleaning up...');
    await cleanupTempFiles(imageDir);
    await fs.unlink(pdfPath);
    console.log('✅ Temporary files removed');

    // Step 5: Return results
    console.log('\n✅ Analysis complete!');
    console.log(`📊 Results: ${analysis.testResults.length} tests found`);
    console.log('📤 Sending response:', JSON.stringify(analysis, null, 2));
    console.log('🏥 ======================================\n');

    res.json(analysis);

  } catch (error) {
    console.error('\n❌ Error during analysis:', error.message);
    console.error(error.stack);

    // Clean up on error
    try {
      if (imageDir) await cleanupTempFiles(imageDir);
      if (pdfPath) await fs.unlink(pdfPath);
    } catch (cleanupError) {
      console.error('⚠️  Error during cleanup:', cleanupError.message);
    }

    // Send error response
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred during analysis',
      patientInfo: {},
      testResults: [],
      summary: ''
    });
  }
});

// ============================================
// Error Handlers for Multer
// ============================================

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 10MB limit'
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${error.message}`
    });
  }

  if (error.message === 'Only PDF files are allowed') {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  next(error);
});

module.exports = router;
