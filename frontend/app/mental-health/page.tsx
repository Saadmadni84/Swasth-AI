'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import axios from 'axios';
import { Heart, Brain, Moon, Footprints, Activity, TrendingUp, Sparkles } from 'lucide-react';
import Navbar from '@/components/navbar';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SmartwatchReading {
  id: number;
  timestamp: string;
  heartRate: number;
  stressLevel: number;
  sleepHours: number;
  steps: number;
  mentalHealthScore: number;
}

interface ScoreData {
  averageScore: number;
  status: string;
  readingsCount: number;
}

interface RecommendationsData {
  recommendations: string[];
  currentScore: number;
  timestamp: string;
}

export default function MentalHealthDashboard() {
  const [readings, setReadings] = useState<SmartwatchReading[]>([]);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API endpoint (Node backend for smartwatch on port 5002)
  const API_BASE = 'http://localhost:5002/api/smartwatch';

  // Fetch all data
  const fetchData = async () => {
    try {
      const [readingsRes, scoreRes, recsRes] = await Promise.all([
        axios.get(`${API_BASE}/data`),
        axios.get(`${API_BASE}/score`),
        axios.get(`${API_BASE}/recommendations`)
      ]);

      setReadings(readingsRes.data.data);
      setScoreData(scoreRes.data);
      setRecommendations(recsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching smartwatch data:', err);
      setError('Failed to connect to smartwatch API. Make sure backend is running on port 5002.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Get latest reading
  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;

  // Prepare chart data
  const chartData = {
    labels: readings.map(r => new Date(r.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Mental Health Score',
        data: readings.map(r => r.mentalHealthScore),
        borderColor: '#669bbc',
        backgroundColor: 'rgba(102, 155, 188, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: '#669bbc',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      },
      {
        label: 'Stress Level',
        data: readings.map(r => r.stressLevel),
        borderColor: '#c1121f',
        backgroundColor: 'rgba(193, 18, 31, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#c1121f',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fdf0d5',
          font: {
            size: 14,
            weight: 'bold' as const
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 48, 73, 0.9)',
        titleColor: '#fdf0d5',
        bodyColor: '#669bbc',
        borderColor: '#669bbc',
        borderWidth: 1,
        padding: 12,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        grid: {
          color: 'rgba(102, 155, 188, 0.1)'
        },
        ticks: {
          color: '#669bbc'
        }
      },
      x: {
        grid: {
          color: 'rgba(102, 155, 188, 0.1)'
        },
        ticks: {
          color: '#669bbc'
        }
      }
    }
  };

  // Get status color
  const getStatusColor = (score: number) => {
    if (score >= 8) return { bg: 'from-green-500/20 to-emerald-500/20', text: 'text-green-400', border: 'border-green-500/30' };
    if (score >= 5) return { bg: 'from-yellow-500/20 to-amber-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    return { bg: 'from-red-500/20 to-rose-500/20', text: 'text-red-400', border: 'border-red-500/30' };
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] via-[#f5f0ff] to-[#fdfbf7] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"
          />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] via-[#f5f0ff] to-[#fdfbf7] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-sm border border-red-300 rounded-2xl p-8 max-w-md text-center shadow-lg"
          >
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-md"
            >
              Retry Connection
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  const statusColors = scoreData ? getStatusColor(scoreData.averageScore) : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] via-[#f5f0ff] to-[#fdfbf7] pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-purple-200/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-purple-300/10 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-12 h-12 text-purple-600" />
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-gray-900 bg-clip-text text-transparent">
                Mental Health Dashboard
              </h1>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Sparkles className="w-12 h-12 text-purple-600" />
              </motion.div>
            </div>
            <p className="text-gray-700 text-lg">Real-time smartwatch monitoring for your mental wellness</p>
          </motion.div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Heart Rate Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="w-10 h-10 text-red-500" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-red-500 rounded-full"
                  />
                </div>
                <h3 className="text-gray-700 text-sm font-medium mb-2">Heart Rate</h3>
                <p className="text-4xl font-bold text-red-500 mb-1">
                  {latestReading?.heartRate || 0}
                </p>
                <p className="text-xs text-gray-600">bpm</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/5 to-transparent rounded-full blur-2xl" />
              </div>
            </motion.div>

            {/* Stress Level Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-10 h-10 text-orange-500" />
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-6 rounded-full transition-all duration-300 ${
                          i < (latestReading?.stressLevel || 0) ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-gray-700 text-sm font-medium mb-2">Stress Level</h3>
                <p className="text-4xl font-bold text-orange-500 mb-1">
                  {latestReading?.stressLevel || 0}/10
                </p>
                <p className="text-xs text-gray-600">Current stress index</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-2xl" />
              </div>
            </motion.div>

            {/* Sleep Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Moon className="w-10 h-10 text-indigo-500" />
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
                  />
                </div>
                <h3 className="text-gray-700 text-sm font-medium mb-2">Sleep</h3>
                <p className="text-4xl font-bold text-indigo-500 mb-1">
                  {latestReading?.sleepHours.toFixed(1) || 0}
                </p>
                <p className="text-xs text-gray-600">hours last night</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full blur-2xl" />
              </div>
            </motion.div>

            {/* Steps Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Footprints className="w-10 h-10 text-green-500" />
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </motion.div>
                </div>
                <h3 className="text-gray-700 text-sm font-medium mb-2">Steps</h3>
                <p className="text-4xl font-bold text-green-500 mb-1">
                  {(latestReading?.steps || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">steps today</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>

          {/* Chart and Mental Health Score Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-gray-900 text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  Trends Over Time
                </h3>
                <div className="h-80">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </motion.div>

            {/* Mental Health Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 h-full flex flex-col shadow-sm hover:shadow-md transition-all">
                <h3 className="text-gray-900 text-xl font-bold mb-6 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  Mental Health Score
                </h3>
                
                {scoreData && (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: 'spring' }}
                      className={`relative w-40 h-40 rounded-full bg-gradient-to-br ${statusColors?.bg} border-4 ${statusColors?.border} flex items-center justify-center mb-6`}
                    >
                      <div className="text-center">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className={`text-6xl font-bold ${statusColors?.text}`}
                        >
                          {scoreData.averageScore.toFixed(1)}
                        </motion.p>
                        <p className="text-sm text-gray-600">/ 10</p>
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className={`absolute inset-0 rounded-full border-t-4 ${statusColors?.border} opacity-30`}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className={`px-6 py-3 rounded-xl bg-gradient-to-r ${statusColors?.bg} border ${statusColors?.border}`}
                    >
                      <p className={`text-xl font-bold ${statusColors?.text} text-center`}>
                        {scoreData.status}
                      </p>
                    </motion.div>

                    <p className="text-[#669bbc] text-sm mt-4 text-center">
                      Based on {scoreData.readingsCount} readings
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />
            <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-gray-900 text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Personalized Recommendations
              </h3>
              
              {recommendations && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-purple-50 to-transparent border border-purple-200 rounded-xl p-4 hover:border-purple-300 transition-all duration-300"
                    >
                      <p className="text-gray-700 text-sm leading-relaxed">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-6"
          >
            <p className="text-gray-700 text-sm">
              Last updated: {latestReading ? new Date(latestReading.timestamp).toLocaleString() : 'N/A'}
            </p>
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 mt-2 text-xs text-gray-600"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live data updating every 10 seconds
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
