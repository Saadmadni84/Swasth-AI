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

  const API_BASE = 'http://localhost:5001/api/smartwatch';

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
      setError('Failed to connect to smartwatch API. Make sure backend is running on port 5001.');
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
        <div className="min-h-screen bg-gradient-to-br from-[#003049] via-[#003049] to-[#002035] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-[#669bbc] border-t-transparent rounded-full"
          />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#003049] via-[#003049] to-[#002035] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center"
          >
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-3 bg-gradient-to-r from-[#669bbc] to-[#003049] text-white rounded-xl font-semibold hover:scale-105 transition-transform"
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
      <div className="min-h-screen bg-gradient-to-br from-[#003049] via-[#003049] to-[#002035] pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-[#669bbc]/20 to-[#003049]/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-[#780000]/20 to-[#c1121f]/20 rounded-full blur-3xl"
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
                <Brain className="w-12 h-12 text-[#669bbc]" />
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#fdf0d5] via-[#669bbc] to-[#fdf0d5] bg-clip-text text-transparent">
                Mental Health Dashboard
              </h1>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Sparkles className="w-12 h-12 text-[#669bbc]" />
              </motion.div>
            </div>
            <p className="text-[#669bbc] text-lg">Real-time smartwatch monitoring for your mental wellness</p>
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
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-[#003049]/90 to-[#002035]/90 backdrop-blur-sm border border-[#669bbc]/20 rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="w-10 h-10 text-red-400" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-red-400 rounded-full"
                  />
                </div>
                <h3 className="text-[#fdf0d5] text-sm font-medium mb-2">Heart Rate</h3>
                <p className="text-4xl font-bold text-red-400 mb-1">
                  {latestReading?.heartRate || 0}
                </p>
                <p className="text-xs text-[#669bbc]">bpm</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl" />
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
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-[#003049]/90 to-[#002035]/90 backdrop-blur-sm border border-[#669bbc]/20 rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-10 h-10 text-orange-400" />
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-6 rounded-full transition-all duration-300 ${
                          i < (latestReading?.stressLevel || 0) ? 'bg-orange-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-[#fdf0d5] text-sm font-medium mb-2">Stress Level</h3>
                <p className="text-4xl font-bold text-orange-400 mb-1">
                  {latestReading?.stressLevel || 0}/10
                </p>
                <p className="text-xs text-[#669bbc]">Current stress index</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl" />
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
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-[#003049]/90 to-[#002035]/90 backdrop-blur-sm border border-[#669bbc]/20 rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <Moon className="w-10 h-10 text-indigo-400" />
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full"
                  />
                </div>
                <h3 className="text-[#fdf0d5] text-sm font-medium mb-2">Sleep</h3>
                <p className="text-4xl font-bold text-indigo-400 mb-1">
                  {latestReading?.sleepHours.toFixed(1) || 0}
                </p>
                <p className="text-xs text-[#669bbc]">hours last night</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl" />
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
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-[#003049]/90 to-[#002035]/90 backdrop-blur-sm border border-[#669bbc]/20 rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <Footprints className="w-10 h-10 text-green-400" />
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </motion.div>
                </div>
                <h3 className="text-[#fdf0d5] text-sm font-medium mb-2">Steps</h3>
                <p className="text-4xl font-bold text-green-400 mb-1">
                  {(latestReading?.steps || 0).toLocaleString()}
                </p>
                <p className="text-xs text-[#669bbc]">steps today</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl" />
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#669bbc]/10 to-[#003049]/10 rounded-2xl blur-xl" />
              <div className="relative bg-gradient-to-br from-[#003049]/90 to-[#002035]/90 backdrop-blur-sm border border-[#669bbc]/20 rounded-2xl p-6">
                <h3 className="text-[#fdf0d5] text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#669bbc]" />
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#669bbc]/10 to-[#003049]/10 rounded-2xl blur-xl" />
              <div className="relative bg-gradient-to-br from-[#003049]/90 to-[#002035]/90 backdrop-blur-sm border border-[#669bbc]/20 rounded-2xl p-6 h-full flex flex-col">
                <h3 className="text-[#fdf0d5] text-xl font-bold mb-6 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-[#669bbc]" />
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
                        <p className="text-sm text-[#669bbc]">/ 10</p>
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#669bbc]/10 to-[#003049]/10 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-br from-[#003049]/90 to-[#002035]/90 backdrop-blur-sm border border-[#669bbc]/20 rounded-2xl p-6">
              <h3 className="text-[#fdf0d5] text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#669bbc]" />
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
                      className="bg-gradient-to-br from-[#669bbc]/10 to-transparent border border-[#669bbc]/30 rounded-xl p-4 hover:border-[#669bbc]/50 transition-all duration-300"
                    >
                      <p className="text-[#fdf0d5] text-sm leading-relaxed">{rec}</p>
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
            <p className="text-[#669bbc] text-sm">
              Last updated: {latestReading ? new Date(latestReading.timestamp).toLocaleString() : 'N/A'}
            </p>
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 mt-2 text-xs text-[#669bbc]/70"
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
