// ============================================
// OCR Utility - Text Extraction from Images
// ============================================

const Tesseract = require('tesseract.js');
const path = require('path');

/**
 * Extract text from an image using Tesseract OCR
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromImage(imagePath) {
  console.log(`📸 Starting OCR on: ${path.basename(imagePath)}`);
  
  try {
    const result = await Tesseract.recognize(
      imagePath,
      'eng', // Language: English
      {
        logger: (info) => {
          // Log OCR progress
          if (info.status === 'recognizing text') {
            console.log(`   OCR Progress: ${Math.round(info.progress * 100)}%`);
          }
        },
        // Enhanced OCR configuration for better accuracy
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:-/()% @',
        preserve_interword_spaces: '1',
      }
    );

    console.log(`✅ OCR completed for: ${path.basename(imagePath)}`);
    console.log(`📝 Raw OCR text length: ${result.data.text.length} characters`);
    
    // Log first 200 characters for debugging
    console.log(`📝 First 200 chars: "${result.data.text.substring(0, 200)}"`);
    
    return result.data.text;
  } catch (error) {
    console.error(`❌ OCR failed for ${path.basename(imagePath)}:`, error.message);
    throw new Error(`OCR extraction failed: ${error.message}`);
  }
}

/**
 * Clean and normalize extracted text
 * @param {string} text - Raw OCR text
 * @returns {string} - Cleaned text
 */
function cleanText(text) {
  if (!text) return '';
  
  return text
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive blank lines (more than 2)
    .replace(/\n{3,}/g, '\n\n')
    // Normalize spaces (but keep structure)
    .replace(/[ \t]+/g, ' ')
    // Remove spaces at start and end of lines
    .split('\n').map(line => line.trim()).join('\n')
    // Trim overall
    .trim();
}

/**
 * Extract text from multiple images (PDF pages)
 * @param {string[]} imagePaths - Array of image paths
 * @returns {Promise<string>} - Combined extracted text
 */
async function extractTextFromMultipleImages(imagePaths) {
  console.log(`📚 Processing ${imagePaths.length} page(s)...`);
  
  const textPromises = imagePaths.map(async (imagePath, index) => {
    console.log(`\n📄 Page ${index + 1}/${imagePaths.length}`);
    const text = await extractTextFromImage(imagePath);
    return cleanText(text);
  });

  const texts = await Promise.all(textPromises);
  const combinedText = texts.join('\n\n--- Page Break ---\n\n');
  
  console.log(`\n✅ All pages processed successfully`);
  console.log(`📊 Total characters extracted: ${combinedText.length}`);
  
  return combinedText;
}

module.exports = {
  extractTextFromImage,
  extractTextFromMultipleImages,
  cleanText
};
