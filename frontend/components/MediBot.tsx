'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Activity, Upload, FileText, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import Avatar3D from '@/components/Avatar3D';

// Types for message structure
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  file?: {
    name: string;
    summary?: string;
  };
}

// Health tips data
const HEALTH_TIPS = [
  "💧 Drink at least 8 glasses of water daily to stay hydrated.",
  "🏃‍♂️ 30 minutes of exercise daily can improve your overall health.",
  "🥗 Include colorful vegetables in every meal for better nutrition.",
  "😴 Get 7-9 hours of quality sleep each night for optimal health.",
  "🧘‍♀️ Practice mindfulness or meditation to reduce stress levels.",
  "🦷 Brush your teeth twice daily and floss regularly.",
  "👐 Wash your hands frequently to prevent infections.",
  "📱 Take regular breaks from screens to protect your eyes.",
];

// Regional language options
const LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'ur-PK', name: 'اردو (Urdu)', flag: '🇵🇰' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
];

export default function MediBot() {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTip, setCurrentTip] = useState(HEALTH_TIPS[0]);
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Voice assistant state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive - but only scroll the chat container, not the page
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMessages([
        {
          id: '1',
          text: "Hello! I'm MediBot, your AI Health Assistant powered by SwasthAI's n8n workflow and Ollama. I can help you with symptom analysis and traditional Indian home remedies. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      
      // Ensure page is at top after loading
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Rotate health tips every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTip = HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
      setCurrentTip(randomTip);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Initialize voice recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for speech recognition support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setVoiceSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = selectedLanguage;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      // Check for speech synthesis support
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Update recognition language when selected language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  // Voice Recognition handlers
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Text-to-Speech handler
  const speakText = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      // Get voices and try to match the selected language
      const voices = synthRef.current.getVoices();
      const voice = voices.find(v => v.lang.startsWith(selectedLanguage.split('-')[0])) || 
                    voices.find(v => v.lang === selectedLanguage);
      
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputText;
    setInputText('');
    setIsTyping(true);
    
    // Prevent any scroll
    const currentScroll = window.scrollY;

    try {
      // Call Flask backend which integrates with n8n workflow
      const backendUrl = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:5003';
      
      const response = await fetch(`${backendUrl}/analyze/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userInput,
          use_n8n: true  // Use n8n workflow with Ollama
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.prediction || data.finalResponse || 'I apologize, but I couldn\'t process your request. Please try again or consult a healthcare professional.',
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        
        // Speak the bot's response if voice is enabled
        if (voiceSupported && botMessage.text) {
          speakText(botMessage.text);
        }
      } else {
        // Fallback to local response if API fails
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.error || getBotResponse(userInput) + '\n\n⚠️ Note: AI service is temporarily unavailable. Please consult a healthcare professional for accurate medical advice.',
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        
        // Speak the bot's response if voice is enabled
        if (voiceSupported && botMessage.text) {
          speakText(botMessage.text);
        }
      }
    } catch (error) {
      console.error('Error calling n8n workflow:', error);
      // Fallback to local response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userInput) + '\n\n⚠️ Note: Unable to connect to AI service. Please ensure the backend is running. For medical concerns, consult a healthcare professional.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      
      // Speak the bot's response if voice is enabled
      if (voiceSupported && botMessage.text) {
        speakText(botMessage.text);
      }
    } finally {
      setIsTyping(false);
      // Restore scroll position
      window.scrollTo(0, currentScroll);
    }
  };

  // Handle file upload and OCR analysis
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file');
      setTimeout(() => setUploadError(''), 3000);
      return;
    }

    setIsAnalyzing(true);
    setUploadError('');

    // Add user message showing file upload
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `Uploaded medical report: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      file: {
        name: file.name,
      },
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Format OCR results as a bot message
        let resultText = '📄 **Medical Report Analysis**\n\n';
        
        if (data.patientInfo) {
          resultText += '👤 **Patient Information:**\n';
          Object.entries(data.patientInfo).forEach(([key, value]) => {
            if (value) resultText += `• ${key}: ${value}\n`;
          });
          resultText += '\n';
        }

        if (data.testResults && data.testResults.length > 0) {
          resultText += '🔬 **Test Results:**\n';
          data.testResults.forEach((test: any) => {
            resultText += `\n**${test.testName}**\n`;
            resultText += `• Value: ${test.value}\n`;
            if (test.unit) resultText += `• Unit: ${test.unit}\n`;
            if (test.referenceRange) resultText += `• Reference: ${test.referenceRange}\n`;
            if (test.status) resultText += `• Status: ${test.status}\n`;
          });
          resultText += '\n';
        }

        if (data.summary) {
          resultText += '📋 **Summary:**\n';
          resultText += data.summary;
        }

        resultText += '\n\n⚠️ **Note:** This is an automated analysis. Please consult a healthcare professional for proper medical interpretation.';

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: resultText,
          sender: 'bot',
          timestamp: new Date(),
          file: {
            name: file.name,
            summary: data.summary,
          },
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Failed to analyze document');
      }
    } catch (error) {
      console.error('Error analyzing file:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ Sorry, I encountered an error analyzing your medical report. Please make sure:\n\n• The file is a valid PDF\n• The PDF contains readable text or clear images\n• The backend server is running on port 5001\n\nPlease try again or consult a healthcare professional.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      handleFileUpload(file);
    }
  };

  // Handle file button click
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle removing selected file
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Simulate bot response (replace with actual AI API integration)
  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! I'm here to assist you with your health queries. What would you like to know?";
    } else if (input.includes('headache') || input.includes('pain')) {
      return "For headaches, try resting in a quiet, dark room and staying hydrated. If pain persists or worsens, please consult a healthcare professional.";
    } else if (input.includes('fever') || input.includes('temperature')) {
      return "For fever, rest, stay hydrated, and monitor your temperature. If it exceeds 103°F (39.4°C) or persists for more than 3 days, seek medical attention.";
    } else if (input.includes('thank')) {
      return "You're welcome! Remember, I'm here whenever you need health guidance. Stay healthy! 💙";
    } else {
      return "I understand your concern. While I can provide general health information, please consult a qualified healthcare professional for personalized medical advice and diagnosis.";
    }
  };

  // Handle starting new chat
  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "Hello! I'm MediBot, your AI Health Assistant powered by SwasthAI's n8n workflow and Ollama. I can help you with symptom analysis and traditional Indian home remedies. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setInputText('');
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3 bg-white rounded-2xl shadow-md max-w-[80px]">
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );

  // Loading spinner component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-spin" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0)' }} />
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Initializing MediBot</h2>
          <p className="text-blue-600">Preparing your AI Health Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 animate-gradient-slow">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🩺</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                MediBot
              </h1>
              <p className="text-sm text-blue-600 font-medium">Your AI Health Assistant</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden flex flex-col h-[600px]">
              {/* Chat Messages */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[75%] sm:max-w-[70%] px-5 py-3 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-none'
                          : 'bg-white border-2 border-blue-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {/* Show file icon for file uploads */}
                      {message.file && (
                        <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${
                          message.sender === 'user' ? 'border-blue-300' : 'border-blue-200'
                        }`}>
                          <FileText className={`w-4 h-4 ${message.sender === 'user' ? 'text-blue-100' : 'text-blue-600'}`} />
                          <span className={`text-xs font-medium ${message.sender === 'user' ? 'text-blue-100' : 'text-blue-600'}`}>
                            {message.file.name}
                          </span>
                        </div>
                      )}
                      
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">{message.text}</p>
                      <span
                        className={`text-xs mt-1 block ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <TypingIndicator />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-blue-100 p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                {/* Voice and language controls */}
                {voiceSupported && (
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* Microphone button */}
                      <button
                        type="button"
                        onClick={isListening ? stopListening : startListening}
                        disabled={isTyping || isAnalyzing}
                        className={`px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center gap-2 ${
                          isListening 
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse' 
                            : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                        }`}
                        title={isListening ? 'Stop Listening' : 'Start Voice Input'}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-4 h-4" />
                            <span className="text-xs">Listening...</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4" />
                            <span className="text-xs hidden sm:inline">Voice</span>
                          </>
                        )}
                      </button>

                      {/* Speaker button */}
                      <button
                        type="button"
                        onClick={isSpeaking ? stopSpeaking : () => {}}
                        disabled={!isSpeaking}
                        className={`px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 ${
                          isSpeaking 
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-xl hover:scale-105 cursor-pointer' 
                            : 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                        }`}
                        title={isSpeaking ? 'Stop Speaking' : 'Bot will speak responses'}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-4 h-4" />
                            <span className="text-xs hidden sm:inline">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            <span className="text-xs hidden sm:inline">Speaker</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Language selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                        className="px-3 py-2 bg-white border-2 border-blue-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-400 transition-all duration-300 flex items-center gap-2"
                        title="Select Language"
                      >
                        <span>{LANGUAGES.find(l => l.code === selectedLanguage)?.flag}</span>
                        <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === selectedLanguage)?.name.split(' ')[0]}</span>
                      </button>

                      {/* Language dropdown */}
                      {showLanguageMenu && (
                        <div className="absolute bottom-full right-0 mb-2 w-64 max-h-80 overflow-y-auto bg-white border-2 border-blue-200 rounded-xl shadow-2xl z-50">
                          {LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => {
                                setSelectedLanguage(lang.code);
                                setShowLanguageMenu(false);
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                                selectedLanguage === lang.code ? 'bg-blue-100 font-semibold' : ''
                              }`}
                            >
                              <span className="text-xl">{lang.flag}</span>
                              <span className="text-sm">{lang.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* File upload error message */}
                {uploadError && (
                  <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {uploadError}
                  </div>
                )}
                
                {/* Show selected file */}
                {uploadedFile && !isAnalyzing && (
                  <div className="mb-3 flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800 flex-1">{uploadedFile.name}</span>
                    <button
                      onClick={handleRemoveFile}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Prevent any scroll by capturing current position
                    const scrollY = window.scrollY;
                    
                    handleSendMessage();
                    
                    // Force maintain scroll position
                    requestAnimationFrame(() => {
                      window.scrollTo(0, scrollY);
                    });
                    
                    return false;
                  }}
                  className="flex gap-3"
                >
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={voiceSupported ? "Type or speak your health question..." : "Type your health question or upload a PDF report..."}
                    className="flex-1 px-5 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    disabled={isTyping || isAnalyzing || isListening}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  />
                  
                  {/* File Upload Button */}
                  <button
                    type="button"
                    onClick={handleFileButtonClick}
                    disabled={isTyping || isAnalyzing}
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center gap-2"
                    title="Upload PDF Report"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span className="hidden sm:inline">Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span className="hidden sm:inline">Upload</span>
                      </>
                    )}
                  </button>
                  
                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping || isAnalyzing}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Health Tips Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-xl">💡</span>
                </div>
                <h3 className="text-xl font-bold text-blue-900">Health Tips</h3>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 mb-4 border-2 border-blue-100 animate-fade-in">
                <p className="text-gray-700 leading-relaxed">{currentTip}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>AI-Powered Health Guidance</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '500ms' }} />
                  <span>24/7 Availability</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1000ms' }} />
                  <span>Instant Responses</span>
                </div>
                {voiceSupported && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '1500ms' }} />
                    <span>🎤 Voice Assistant ({LANGUAGES.find(l => l.code === selectedLanguage)?.name.split(' ')[0]})</span>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-xs text-yellow-800 font-medium">
                  ⚠️ <strong>Disclaimer:</strong> This chatbot provides general health information only. Always consult a healthcare professional for medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating New Chat Button */}
        <button
          onClick={handleNewChat}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group z-50"
          aria-label="Start New Chat"
        >
          <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
        </button>

        {/* 3D Avatar Section */}
        <div className="mt-6 w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600">
              <h3 className="text-lg font-bold text-white text-center">MediBot Virtual Assistant</h3>
            </div>
            <div className="h-96 bg-gradient-to-br from-blue-50 to-cyan-100">
              <Avatar3D isSpeaking={isSpeaking} />
            </div>
            {isSpeaking && (
              <div className="p-3 bg-blue-50 border-t border-blue-100 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 font-medium">Avatar is speaking...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 15s ease infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #60a5fa;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
