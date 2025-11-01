// ============================================
// PDF to Image Conversion Utility
// ============================================

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

/**
 * Convert PDF file to images using system pdftocairo
 * @param {string} pdfPath - Path to PDF file
 * @param {string} outputDir - Directory to save images
 * @returns {Promise<string[]>} Array of image file paths
 */
async function convertPdfToImages(pdfPath, outputDir) {
  try {
    console.log(`📄 Converting PDF to images: ${path.basename(pdfPath)}`);
    
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    const outputPrefix = path.join(outputDir, 'page');
    
    console.log('🔄 Starting PDF conversion...');
    
    // Use system pdftocairo command (installed via Homebrew)
    const command = `pdftocairo -png -r 300 "${pdfPath}" "${outputPrefix}"`;
    
    try {
      execSync(command, { stdio: 'pipe' });
    } catch (execError) {
      throw new Error(`pdftocairo command failed: ${execError.message}`);
    }

    // Get list of generated images
    const files = await fs.readdir(outputDir);
    const imagePaths = files
      .filter(file => file.endsWith('.png'))
      .sort() // Sort by page number
      .map(file => path.join(outputDir, file));

    if (imagePaths.length === 0) {
      throw new Error('No images were generated from the PDF');
    }

    console.log(`✅ Converted PDF to ${imagePaths.length} images`);
    return imagePaths;

  } catch (error) {
    console.error('❌ PDF conversion failed:', error.message);
    throw new Error(`Failed to convert PDF: ${error.message}`);
  }
}

/**
 * Clean up temporary files
 * @param {string} dirPath - Directory to clean
 */
async function cleanupTempFiles(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    
    for (const file of files) {
      await fs.unlink(path.join(dirPath, file));
    }
    
    await fs.rmdir(dirPath);
    console.log(`🧹 Cleaned up temporary files in: ${dirPath}`);
  } catch (error) {
    console.error('⚠️  Cleanup warning:', error.message);
  }
}

module.exports = {
  convertPdfToImages,
  cleanupTempFiles
};
