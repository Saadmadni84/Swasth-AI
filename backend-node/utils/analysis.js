// ============================================
// Analysis Utility - Medical Report Interpretation
// ============================================

/**
 * Extract patient information from OCR text
 * @param {string} text - Extracted OCR text
 * @returns {Object} - Patient information
 */
function extractPatientInfo(text) {
  const patientInfo = {
    name: null,
    age: null,
    gender: null,
    date: null,
    patientId: null
  };

  // Extract patient name (common patterns)
  const namePatterns = [
    /(?:Patient Name|Name|Patient)[:\s]+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/i,
    /(?:Mr\.|Mrs\.|Ms\.)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/i
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      patientInfo.name = match[1].trim();
      break;
    }
  }

  // Extract age
  const ageMatch = text.match(/(?:Age|age)[:\s]+(\d{1,3})\s*(?:years|yrs|Y)?/i);
  if (ageMatch) {
    patientInfo.age = `${ageMatch[1]} years`;
  }

  // Extract gender
  const genderMatch = text.match(/(?:Gender|Sex)[:\s]+(Male|Female|M|F)/i);
  if (genderMatch) {
    const gender = genderMatch[1].toUpperCase();
    patientInfo.gender = gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : gender;
  }

  // Extract date
  const dateMatch = text.match(/(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/);
  if (dateMatch) {
    patientInfo.date = dateMatch[1];
  }

  // Extract patient ID
  const idMatch = text.match(/(?:Patient ID|ID|UHID)[:\s]+([A-Z0-9-]+)/i);
  if (idMatch) {
    patientInfo.patientId = idMatch[1];
  }

  return patientInfo;
}

/**
 * Extract test results from OCR text
 * @param {string} text - Extracted OCR text
 * @returns {Array} - Array of test objects
 */
function extractTestResults(text) {
  const tests = [];

  // Common medical test patterns
  const testPatterns = [
    // Pattern: Test Name: Value Unit (Range)
    /([A-Za-z\s]+(?:Glucose|Cholesterol|Hemoglobin|Creatinine|Triglycerides|HDL|LDL|HbA1c|Blood Pressure|Platelet)(?:[A-Za-z\s]*)?)[:\s]+(\d+\.?\d*)\s*([a-zA-Z/]+)?(?:\s*\(([^)]+)\))?/gi,
    // Pattern: Test Name Value Unit
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+(\d+\.?\d*)\s+([a-zA-Z/]+)/g
  ];

  for (const pattern of testPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const testName = match[1].trim();
      const value = match[2];
      const unit = match[3] || '';
      const range = match[4] || '';

      // Determine status based on test name and value
      const status = determineTestStatus(testName, parseFloat(value), range);

      tests.push({
        test: testName,
        value: value,
        unit: unit,
        range: range,
        status: status
      });
    }
  }

  // Remove duplicates
  const uniqueTests = tests.filter((test, index, self) =>
    index === self.findIndex((t) => t.test === test.test)
  );

  return uniqueTests;
}

/**
 * Determine if a test value is normal, high, or low
 * @param {string} testName - Name of the test
 * @param {number} value - Test value
 * @param {string} range - Normal range
 * @returns {string} - Status: 'normal', 'high', or 'low'
 */
function determineTestStatus(testName, value, range) {
  // Reference ranges for common tests
  const referenceRanges = {
    glucose: { min: 70, max: 100 },
    cholesterol: { min: 0, max: 200 },
    hdl: { min: 40, max: 1000 },
    ldl: { min: 0, max: 100 },
    triglycerides: { min: 0, max: 150 },
    hemoglobin: { min: 12, max: 16 },
    hba1c: { min: 0, max: 5.7 },
    creatinine: { min: 0.6, max: 1.2 }
  };

  // Try to parse range if provided
  if (range) {
    const rangeMatch = range.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      
      if (value < min) return 'low';
      if (value > max) return 'high';
      return 'normal';
    }
  }

  // Use reference ranges
  const testKey = testName.toLowerCase().replace(/\s+/g, '');
  for (const [key, ref] of Object.entries(referenceRanges)) {
    if (testKey.includes(key)) {
      if (value < ref.min) return 'low';
      if (value > ref.max) return 'high';
      return 'normal';
    }
  }

  return 'unknown';
}

/**
 * Generate AI summary of medical report
 * @param {Object} patientInfo - Patient information
 * @param {Array} tests - Test results
 * @param {string} fullText - Complete OCR text
 * @returns {string} - Summary text
 */
function generateSummary(patientInfo, tests, fullText) {
  const abnormalTests = tests.filter(t => t.status === 'high' || t.status === 'low');
  const normalTests = tests.filter(t => t.status === 'normal');

  let summary = `Medical Report Analysis for ${patientInfo.name || 'Patient'}:\n\n`;

  if (tests.length === 0) {
    summary += 'No specific test results were clearly identified in the report. Manual review recommended.\n';
    return summary;
  }

  // Summary of findings
  if (abnormalTests.length === 0) {
    summary += `✅ All ${tests.length} test(s) are within normal ranges.\n\n`;
  } else {
    summary += `⚠️ ${abnormalTests.length} of ${tests.length} test(s) show abnormal values:\n\n`;

    abnormalTests.forEach(test => {
      const indicator = test.status === 'high' ? '↑' : '↓';
      summary += `${indicator} ${test.test}: ${test.value} ${test.unit} (${test.status.toUpperCase()})`;
      if (test.range) {
        summary += ` - Normal range: ${test.range}`;
      }
      summary += '\n';
    });

    summary += '\n';
  }

  // Health recommendations
  if (abnormalTests.some(t => t.test.toLowerCase().includes('glucose') && t.status === 'high')) {
    summary += '📋 Elevated blood glucose detected. Consider dietary modifications and regular monitoring.\n';
  }

  if (abnormalTests.some(t => t.test.toLowerCase().includes('cholesterol') && t.status === 'high')) {
    summary += '📋 High cholesterol levels observed. Lifestyle changes and possible medication may be needed.\n';
  }

  if (abnormalTests.some(t => t.test.toLowerCase().includes('pressure') && t.status === 'high')) {
    summary += '📋 Blood pressure is elevated. Regular monitoring and stress management recommended.\n';
  }

  summary += '\n⚠️ Important: This is an automated analysis. Please consult with your healthcare provider for proper interpretation and treatment recommendations.';

  return summary;
}

/**
 * Analyze complete medical report
 * @param {string} text - Extracted OCR text
 * @returns {Object} - Complete analysis
 */
function analyzeMedicalReport(text) {
  console.log('🔬 Starting medical report analysis...');

  const patientInfo = extractPatientInfo(text);
  console.log('👤 Patient info extracted:', patientInfo.name || 'Unknown');

  const tests = extractTestResults(text);
  console.log(`🧪 Extracted ${tests.length} test result(s)`);

  const summary = generateSummary(patientInfo, tests, text);

  return {
    success: true,
    patientInfo,
    testResults: tests,
    summary
  };
}

module.exports = {
  extractPatientInfo,
  extractTestResults,
  determineTestStatus,
  generateSummary,
  analyzeMedicalReport
};
