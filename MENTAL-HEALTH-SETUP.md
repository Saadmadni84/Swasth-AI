# 🧠 Mental Health Smartwatch Dashboard - Setup Guide

## Overview
The Mental Health Dashboard is a real-time smartwatch monitoring system integrated into SwasthAI. It simulates smartwatch data and provides AI-powered mental health insights and recommendations.

## Architecture

### Backend (Node.js + Express)
- **Port**: 5001
- **Location**: `backend-node/routes/smartwatch.js`
- **Data Generation**: Every 10 seconds
- **Storage**: In-memory (last 10 readings)

### Frontend (Next.js + TypeScript)
- **Port**: 3000
- **Location**: `frontend/app/mental-health/page.tsx`
- **Polling**: Every 10 seconds
- **UI Framework**: React with Framer Motion animations

## Features

### 1. Simulated Smartwatch Data
- **Heart Rate**: 60-140 bpm
- **Stress Level**: 1-10 scale
- **Sleep Hours**: 3-9 hours
- **Steps**: 1000-10000 steps

### 2. Mental Health Score Calculation
```javascript
Base Score: 10

Deductions:
- Stress Level > 7: -2 points
- Sleep < 6 hours: -2 points
- Heart Rate > 120 bpm: -3 points

Bonuses:
- Stress ≤ 4 AND Sleep ≥ 7: +1 point

Final Score: Clamped between 0-10
```

### 3. API Endpoints

#### GET `/api/smartwatch/data`
Returns last 10 readings with timestamps and mental health scores.

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "timestamp": "2025-11-01T10:30:00.000Z",
      "heartRate": 75,
      "stressLevel": 4,
      "sleepHours": 7.5,
      "steps": 8500,
      "mentalHealthScore": 9
    }
  ]
}
```

#### GET `/api/smartwatch/score`
Returns average mental health score and status.

**Response:**
```json
{
  "success": true,
  "averageScore": 7.8,
  "status": "Moderate",
  "readingsCount": 10
}
```

#### GET `/api/smartwatch/recommendations`
Returns personalized health recommendations based on latest reading.

**Response:**
```json
{
  "success": true,
  "recommendations": [
    "🧘 Take a short break and practice deep breathing exercises",
    "🌙 Excellent sleep! Your body is well-rested",
    "💚 Heart rate is in healthy range"
  ],
  "currentScore": 8.5,
  "timestamp": "2025-11-01T10:30:00.000Z"
}
```

#### GET `/api/smartwatch/latest`
Returns only the most recent reading.

## Setup Instructions

### 1. Backend Setup

```bash
cd backend-node

# Install dependencies (if not already installed)
npm install

# Start the server
npm start
```

The backend will:
- Start on `http://localhost:5001`
- Generate initial 10 readings
- Create new readings every 10 seconds
- Log each generation: `📊 New smartwatch reading generated (ID: X)`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies (if not already installed)
npm install axios chart.js react-chartjs-2 framer-motion recharts --legacy-peer-deps

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Access the Dashboard

Navigate to: `http://localhost:3000/mental-health`

Or click **"Mental Health"** (🧠) in the navbar.

## UI Components

### Animated Stat Cards
- **Heart Rate**: Red gradient with pulsing indicator
- **Stress Level**: Orange gradient with 10-bar visual meter
- **Sleep**: Indigo gradient with rotating moon icon
- **Steps**: Green gradient with trending arrow

### Live Chart
- Dual-line chart showing Mental Health Score (blue) and Stress Level (red)
- X-axis: Time stamps
- Y-axis: 0-10 scale
- Smooth animations with Chart.js

### Mental Health Score Display
- Large circular indicator with score
- Color-coded by status:
  - 🟢 Green: Healthy (≥8)
  - 🟡 Yellow: Moderate (5-7)
  - 🔴 Red: Stressed (<5)
- Animated border rotation

### Recommendations Panel
- Grid layout of personalized tips
- Hover effects with lift animation
- Context-aware advice based on metrics

## Color Palette

SwasthAI Official Colors:
- **Primary Blue**: `#003049` (Dark blue background)
- **Accent Cyan**: `#669bbc` (Text, borders, highlights)
- **Dark Red**: `#780000` (Alerts, critical states)
- **Bright Red**: `#c1121f` (Stress indicators)
- **Cream**: `#fdf0d5` (Primary text, headings)

## Animation Details

### Framer Motion Effects
```typescript
// Card entrance
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
whileHover={{ y: -5, scale: 1.02 }}

// Pulsing indicators
animate={{ scale: [1, 1.2, 1] }}
transition={{ duration: 1, repeat: Infinity }}

// Chart slide-up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.5 }}
```

### CSS Shimmer Animation
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

## Customization

### Adjust Data Generation Frequency
Edit `backend-node/routes/smartwatch.js`:

```javascript
// Change from 10000ms (10 seconds) to desired interval
setInterval(() => {
  // ... data generation logic
}, 5000); // 5 seconds
```

### Modify Mental Health Score Algorithm
Edit the `calculateMentalHealthScore()` function in `backend-node/routes/smartwatch.js`:

```javascript
function calculateMentalHealthScore(reading) {
  let score = 10;
  
  // Custom deductions
  if (reading.stressLevel > 8) score -= 3; // Stricter stress penalty
  if (reading.sleepHours < 5) score -= 3;  // Stricter sleep penalty
  
  return Math.max(0, Math.min(10, score));
}
```

### Change Polling Frequency
Edit `frontend/app/mental-health/page.tsx`:

```typescript
// Change from 10000ms to desired interval
const interval = setInterval(fetchData, 5000); // 5 seconds
```

## Troubleshooting

### Backend Not Starting
```bash
# Check if port 5001 is in use
lsof -i :5001

# Kill existing process
pkill -f "node server.js"

# Restart
npm start
```

### CORS Errors
Ensure backend allows frontend origin:
```javascript
// backend-node/server.js
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

### Data Not Updating
1. Check browser console for errors
2. Verify backend is logging: `📊 New smartwatch reading generated`
3. Check network tab for API calls every 10 seconds

### Chart Not Rendering
```bash
# Reinstall Chart.js dependencies
cd frontend
npm install chart.js react-chartjs-2 --legacy-peer-deps
```

## Production Deployment

### Environment Variables

**Backend** (`backend-node/.env`):
```env
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

**Frontend** (`frontend/.env.production`):
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Update API Base URL
Edit `frontend/app/mental-health/page.tsx`:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/smartwatch`
  : 'http://localhost:5001/api/smartwatch';
```

### Database Integration (Optional)
For production, replace in-memory storage with a database:

```javascript
// Using MongoDB example
const Reading = require('./models/Reading');

router.get('/data', async (req, res) => {
  const readings = await Reading.find()
    .sort({ timestamp: -1 })
    .limit(10);
  res.json({ success: true, data: readings });
});
```

## Future Enhancements

1. **Real Smartwatch Integration**
   - Connect to Apple Watch HealthKit
   - Integrate with Fitbit API
   - Support Google Fit data

2. **Historical Analytics**
   - Weekly/monthly trend analysis
   - Export data as CSV/PDF reports
   - Comparative analysis with population averages

3. **AI-Powered Insights**
   - GPT-4 analysis of patterns
   - Predictive mental health modeling
   - Personalized intervention suggestions

4. **Social Features**
   - Share progress with healthcare providers
   - Group challenges and competitions
   - Anonymous community support

5. **Advanced Alerts**
   - SMS/Email notifications for critical scores
   - Family member alerts
   - Emergency contact integration

## Support

For issues or questions:
- GitHub: [@Saadmadni84](https://github.com/Saadmadni84)
- Email: Contact through GitHub profile

---

**Built with ❤️ for mental wellness awareness**
