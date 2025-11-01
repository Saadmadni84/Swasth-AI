// ============================================
// Smartwatch Mental Health API Routes
// ============================================

const express = require('express');
const router = express.Router();

// Store last 10 readings in memory
let readings = [];
let readingId = 0;

// Generate random smartwatch data
function generateSmartwatchData() {
  return {
    id: ++readingId,
    timestamp: new Date().toISOString(),
    heartRate: Math.floor(Math.random() * (140 - 60 + 1)) + 60, // 60-140 bpm
    stressLevel: Math.floor(Math.random() * 10) + 1, // 1-10
    sleepHours: parseFloat((Math.random() * (9 - 3) + 3).toFixed(1)), // 3-9 hours
    steps: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000, // 1000-10000
  };
}

// Calculate mental health score
function calculateMentalHealthScore(reading) {
  let score = 10;
  
  if (reading.stressLevel > 7) score -= 2;
  if (reading.sleepHours < 6) score -= 2;
  if (reading.heartRate > 120) score -= 3;
  
  // Add bonus for good metrics
  if (reading.stressLevel <= 4 && reading.sleepHours >= 7) score += 1;
  
  return Math.max(0, Math.min(10, score)); // Clamp between 0-10
}

// Generate and store new reading every 10 seconds
setInterval(() => {
  const newReading = generateSmartwatchData();
  newReading.mentalHealthScore = calculateMentalHealthScore(newReading);
  
  readings.push(newReading);
  
  // Keep only last 10 readings
  if (readings.length > 10) {
    readings.shift();
  }
  
  console.log(`📊 New smartwatch reading generated (ID: ${newReading.id})`);
}, 10000);

// Initialize with 10 readings
for (let i = 0; i < 10; i++) {
  const reading = generateSmartwatchData();
  reading.mentalHealthScore = calculateMentalHealthScore(reading);
  readings.push(reading);
}

// ============================================
// API Endpoints
// ============================================

// GET /api/smartwatch/data - Get last 10 readings
router.get('/data', (req, res) => {
  try {
    res.json({
      success: true,
      count: readings.length,
      data: readings
    });
  } catch (error) {
    console.error('Error fetching smartwatch data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch smartwatch data'
    });
  }
});

// GET /api/smartwatch/score - Get average mental health score
router.get('/score', (req, res) => {
  try {
    if (readings.length === 0) {
      return res.json({
        success: true,
        averageScore: 0,
        status: 'No data available'
      });
    }
    
    const totalScore = readings.reduce((sum, r) => sum + r.mentalHealthScore, 0);
    const averageScore = parseFloat((totalScore / readings.length).toFixed(1));
    
    let status = 'Healthy';
    if (averageScore < 5) status = 'Stressed';
    else if (averageScore < 8) status = 'Moderate';
    
    res.json({
      success: true,
      averageScore,
      status,
      readingsCount: readings.length
    });
  } catch (error) {
    console.error('Error calculating score:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate mental health score'
    });
  }
});

// GET /api/smartwatch/recommendations - Get health recommendations
router.get('/recommendations', (req, res) => {
  try {
    if (readings.length === 0) {
      return res.json({
        success: true,
        recommendations: ['No data available yet. Start tracking your health!']
      });
    }
    
    const latestReading = readings[readings.length - 1];
    const recommendations = [];
    
    // Stress-based recommendations
    if (latestReading.stressLevel > 7) {
      recommendations.push('🧘 Take a short break and practice deep breathing exercises');
      recommendations.push('💧 Stay hydrated - drink a glass of water');
      recommendations.push('🎵 Listen to calming music or nature sounds');
    } else if (latestReading.stressLevel <= 3) {
      recommendations.push('✨ Great stress management! Keep up the good work');
    }
    
    // Sleep-based recommendations
    if (latestReading.sleepHours < 6) {
      recommendations.push('😴 Consider going to bed earlier tonight - aim for 7-8 hours');
      recommendations.push('📱 Reduce screen time 1 hour before bedtime');
    } else if (latestReading.sleepHours >= 7) {
      recommendations.push('🌙 Excellent sleep! Your body is well-rested');
    }
    
    // Heart rate recommendations
    if (latestReading.heartRate > 120) {
      recommendations.push('❤️ Your heart rate is elevated - take a moment to relax');
      recommendations.push('🪑 Sit down and breathe deeply for 5 minutes');
    } else if (latestReading.heartRate >= 60 && latestReading.heartRate <= 100) {
      recommendations.push('💚 Heart rate is in healthy range');
    }
    
    // Steps recommendations
    if (latestReading.steps < 3000) {
      recommendations.push('🚶 Try to take a short walk - aim for 10,000 steps daily');
    } else if (latestReading.steps >= 8000) {
      recommendations.push('🎯 Fantastic activity level! You\'re crushing your step goal');
    }
    
    // Overall mental health recommendations
    if (latestReading.mentalHealthScore >= 8) {
      recommendations.push('🎉 Outstanding mental wellness! Keep maintaining this balance');
    } else if (latestReading.mentalHealthScore < 5) {
      recommendations.push('🧠 Consider talking to someone you trust or a mental health professional');
      recommendations.push('📝 Try journaling your thoughts and feelings');
    }
    
    res.json({
      success: true,
      recommendations,
      currentScore: latestReading.mentalHealthScore,
      timestamp: latestReading.timestamp
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

// GET /api/smartwatch/latest - Get latest reading only
router.get('/latest', (req, res) => {
  try {
    if (readings.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No readings available'
      });
    }
    
    res.json({
      success: true,
      data: readings[readings.length - 1]
    });
  } catch (error) {
    console.error('Error fetching latest reading:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest reading'
    });
  }
});

module.exports = router;
