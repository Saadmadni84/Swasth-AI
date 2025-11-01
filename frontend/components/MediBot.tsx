'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Activity } from 'lucide-react';

// Types for message structure
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
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

export default function MediBot() {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTip, setCurrentTip] = useState(HEALTH_TIPS[0]);
  
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
          text: "Hello! I'm MediBot, your AI Health Assistant. How can I help you today?",
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
    setInputText('');
    setIsTyping(true);
    
    // Prevent any scroll
    const currentScroll = window.scrollY;

    // Simulate bot response (replace this with actual API call)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      
      // Restore scroll position
      window.scrollTo(0, currentScroll);
    }, 2000);
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
        text: "Hello! I'm MediBot, your AI Health Assistant. How can I help you today?",
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
                      <p className="text-sm sm:text-base leading-relaxed">{message.text}</p>
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
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your health question here..."
                    className="flex-1 px-5 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    disabled={isTyping}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
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
