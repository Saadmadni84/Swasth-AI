'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';

interface PatientInfo {
  name?: string;
  age?: string;
  gender?: string;
  date?: string;
  [key: string]: string | undefined;
}

interface TestResult {
  test: string;
  value: string;
  unit?: string;
  range?: string;
  status?: 'normal' | 'high' | 'low';
}

interface AnalysisResponse {
  patientInfo: PatientInfo;
  testResults: TestResult[];
  summary: string;
  success: boolean;
  error?: string;
}

export default function MedicalOCRAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Please upload a PDF file only');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a PDF file only');
      }
    }
  };

  const handleProcessFile = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data: AnalysisResponse = await response.json();
      
      console.log('Backend response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || 'Failed to analyze the report');
      }
    } catch (err) {
      console.error('Error processing file:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process the file. Please try again.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setResults(null);
    setError('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
          <FileText className="text-blue-600" size={36} />
          Medical Report Analyzer
        </h2>
        <p className="text-gray-600">Upload your medical report PDF for AI-powered analysis</p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100"
      >
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : file
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.div
              animate={{ scale: dragActive ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {file ? (
                <CheckCircle className="text-green-600 mb-4" size={64} />
              ) : (
                <Upload className="text-blue-600 mb-4" size={64} />
              )}
            </motion.div>
            
            {file ? (
              <div className="text-center">
                <p className="text-lg font-semibold text-green-700 mb-2">File Selected</p>
                <p className="text-gray-700 font-medium flex items-center gap-2">
                  <FileText size={20} />
                  {file.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-sm text-gray-500">PDF files only, up to 10MB</p>
              </div>
            )}
          </label>

          {file && (
            <button
              onClick={clearFile}
              className="absolute top-4 right-4 p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
              aria-label="Remove file"
            >
              <X className="text-red-600" size={20} />
            </button>
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="text-red-600" size={24} />
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Process Button */}
        <motion.button
          whileHover={{ scale: file && !isProcessing ? 1.02 : 1 }}
          whileTap={{ scale: file && !isProcessing ? 0.98 : 1 }}
          onClick={handleProcessFile}
          disabled={!file || isProcessing}
          className={`w-full mt-6 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
            !file || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Processing Report...
            </>
          ) : (
            <>
              <FileText size={24} />
              Process Medical Report
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Patient Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results.patientInfo).map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                  >
                    <p className="text-sm text-blue-600 font-medium capitalize mb-1">{key}</p>
                    <p className="text-gray-900 font-semibold">{value || 'N/A'}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Test Results */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Test Results
              </h3>
              <div className="space-y-3">
                {results.testResults.map((test, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      test.status === 'normal'
                        ? 'bg-green-50 border-green-500'
                        : test.status === 'high'
                        ? 'bg-red-50 border-red-500'
                        : test.status === 'low'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{test.test}</p>
                        {test.range && (
                          <p className="text-sm text-gray-600 mt-1">Normal Range: {test.range}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {test.value} {test.unit}
                        </p>
                        {test.status && (
                          <span
                            className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                              test.status === 'normal'
                                ? 'bg-green-200 text-green-800'
                                : test.status === 'high'
                                ? 'bg-red-200 text-red-800'
                                : 'bg-yellow-200 text-yellow-800'
                            }`}
                          >
                            {test.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-indigo-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                AI-Generated Summary
              </h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg p-5 text-gray-700 leading-relaxed"
              >
                {results.summary}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4"
            >
              <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Report</h3>
              <p className="text-gray-600">Please wait while we process your medical report...</p>
              <div className="mt-6 space-y-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
