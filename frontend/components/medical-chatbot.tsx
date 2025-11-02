"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Avatar3D from "@/components/Avatar3D"
import { 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  Image, 
  Bot, 
  User, 
  Heart, 
  Activity,
  Stethoscope,
  Plus,
  X
} from "lucide-react"

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  mediaType?: 'text' | 'image' | 'voice'
  mediaUrl?: string
}

export default function MedicalChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m SwasthAI, your AI-powered health assistant powered by Ollama and n8n workflows. I specialize in traditional Indian home remedies and symptom analysis.\n\nI can help you with:\n• Symptom analysis and explanations\n• Traditional Indian (desi) home remedy suggestions\n• Understanding possible causes of symptoms\n• Preventive measures and health tips\n\n⚠️ **Important**: I provide general health information and home remedies only. For serious concerns, emergencies, or specific medical advice, please consult a qualified healthcare professional immediately.\n\nHow can I assist you today?',
      timestamp: new Date(),
      mediaType: 'text'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking')
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false)
  const [lastBotMessage, setLastBotMessage] = useState<string>('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const scrollToBottom = () => {
    // Add a small delay to ensure DOM has updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      })
    }, 100)
  }

  useEffect(() => {
    // Only auto-scroll when new messages are added, not when the component first loads
    if (messages.length > 1) {
      scrollToBottom()
    }
  }, [messages.length])

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Check if Flask backend is running
        const response = await fetch('http://localhost:5001/', {
          method: 'GET',
        })
        setApiStatus(response.ok ? 'online' : 'offline')
      } catch (error) {
        setApiStatus('offline')
      }
    }
    
    checkApiStatus()
  }, [])

  const handleSendMessage = async (content: string, mediaType: 'text' | 'image' | 'voice' = 'text', mediaUrl?: string) => {
    if (!content.trim() && mediaType === 'text') return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content || (mediaType === 'image' ? 'Image uploaded' : 'Voice message'),
      timestamp: new Date(),
      mediaType,
      mediaUrl
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      // Call Flask backend which integrates with n8n workflow
      // Flask backend URL - use environment variable or default to localhost:5003
      const backendUrl = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:5003'
      
      const response = await fetch(`${backendUrl}/analyze/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          use_n8n: true  // Use n8n workflow with Ollama
        }),
      })

      const data = await response.json()

      if (response.ok && data.status === 'success') {
        setApiStatus('online')
        const responseText = data.prediction || data.finalResponse || 'I apologize, but I couldn\'t process your request. Please try again or consult a healthcare professional.'
        
        // Extract the prediction/response from n8n workflow
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: responseText,
          timestamp: new Date(),
          mediaType: 'text'
        }
        setMessages(prev => [...prev, botResponse])
        setLastBotMessage(responseText)
        
        // Speak the response using Web Speech API
        speakText(responseText)
      } else {
        setApiStatus('offline')
        // Fallback response if API fails
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.error || 'I\'m experiencing technical difficulties with the AI service. Please ensure the backend and n8n workflow are running. For immediate concerns, please consult a healthcare professional.',
          timestamp: new Date(),
          mediaType: 'text'
        }
        setMessages(prev => [...prev, errorResponse])
      }
    } catch (error) {
      console.error('Error calling n8n workflow via Flask backend:', error)
      setApiStatus('offline')
      // Fallback to local response if API is unavailable
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
          content: `I'm unable to connect to the AI service right now. ${getAIResponse(content, mediaType)}\n\n⚠️ Note: Please ensure:\n• Flask backend is running on port 5003\n• n8n workflow is active\n• Ollama is running\n\nFor immediate medical concerns, please consult a healthcare professional.`,
        timestamp: new Date(),
        mediaType: 'text'
      }
      setMessages(prev => [...prev, fallbackResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const getAIResponse = (userInput: string, mediaType: string): string => {
    // Simulate different responses based on input type
    if (mediaType === 'image') {
      return "I can see the image you've shared. Based on what I observe, I'd recommend consulting with a healthcare professional for a proper diagnosis. In the meantime, here are some general care tips..."
    }
    
    if (mediaType === 'voice') {
      return "I've processed your voice message. Thank you for sharing your concerns. Based on what you've described, here's what I recommend..."
    }

    // Simple text response simulation
    const responses = [
      "Thank you for sharing your symptoms. Based on what you've described, I recommend monitoring your condition and consulting with a healthcare provider if symptoms persist.",
      "I understand your concerns. Here are some general recommendations that might help, but please consult a medical professional for personalized advice.",
      "Your health question is important. While I can provide general guidance, it's best to seek professional medical advice for proper diagnosis and treatment.",
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputText)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        handleSendMessage('', 'image', imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(blob)
        handleSendMessage('Voice message recorded', 'voice', audioUrl)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return // Speech synthesis not supported
    }

    // Clean text - remove markdown formatting
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/⚠️|✅|❌|🎉/g, '')
      .trim()

    if (!cleanText) return

    // Cancel any ongoing speech
    if (synthRef.current) {
      synthRef.current.cancel()
    }

    const synth = window.speechSynthesis
    synthRef.current = synth

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 0.8

    utterance.onstart = () => {
      setIsAvatarSpeaking(true)
    }

    utterance.onend = () => {
      setIsAvatarSpeaking(false)
    }

    utterance.onerror = () => {
      setIsAvatarSpeaking(false)
    }

    synth.speak(utterance)
  }

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white/80 backdrop-blur-lg border border-slate-200/50 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg animate-pulse">
              <Stethoscope className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">SwasthAI Medical Assistant</h2>
              <p className="text-blue-100 text-sm">Your AI-powered healthcare companion • Powered by Google Gemini</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                {apiStatus === 'online' && (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-medium text-white">Online</span>
                  </>
                )}
                {apiStatus === 'offline' && (
                  <>
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs font-medium text-white">Offline</span>
                  </>
                )}
                {apiStatus === 'checking' && (
                  <>
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-xs font-medium text-white">Connecting</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50 to-blue-50/30 relative scroll-smooth">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  <g fill="#4F46E5" fillOpacity="0.1">
                    <circle cx="30" cy="30" r="4"/>
                  </g>
                </g>
              </svg>
            </div>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`relative flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div className={`max-w-[75%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`relative p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white ml-auto'
                        : 'bg-white/90 text-slate-800 border border-slate-200/50'
                    }`}>
                      {message.mediaType === 'image' && message.mediaUrl && (
                        <img 
                          src={message.mediaUrl} 
                          alt="Uploaded image" 
                          className="max-w-full h-32 object-cover rounded mb-2"
                        />
                      )}
                      {message.mediaType === 'voice' && message.mediaUrl && (
                        <audio controls className="mb-2">
                          <source src={message.mediaUrl} type="audio/wav" />
                        </audio>
                      )}
                      <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        message.type === 'user' ? 'text-white' : 'text-slate-700'
                      }`}>{message.content}</div>
                      
                      {/* Message tail */}
                      <div className={`absolute top-4 w-3 h-3 ${
                        message.type === 'user'
                          ? '-right-1 bg-gradient-to-br from-blue-500 to-indigo-600 transform rotate-45'
                          : '-left-1 bg-white/90 border-l border-t border-slate-200/50 transform rotate-45'
                      }`} />
                    </div>
                    <p className={`text-xs mt-2 px-1 ${
                      message.type === 'user' ? 'text-right text-blue-600' : 'text-left text-slate-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-white/90 text-slate-800 border border-slate-200/50 rounded-2xl p-4 shadow-lg backdrop-blur-sm relative">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-slate-600 font-medium">SwasthAI is thinking...</span>
                  </div>
                  <div className="absolute top-4 -left-1 w-3 h-3 bg-white/90 border-l border-t border-slate-200/50 transform rotate-45" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-slate-200/50">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your health concerns..."
                  className="pr-12 h-12 bg-white/90 border-2 border-slate-200/50 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOptions(!showOptions)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
                >
                  {showOptions ? <X className="h-4 w-4 text-slate-600" /> : <Plus className="h-4 w-4 text-slate-600" />}
                </Button>
              </div>
              
              <Button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>

            {/* Options Menu */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-2 mt-2"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Image className="h-4 w-4" />
                    Upload Image
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 ${isRecording ? 'bg-red-100 text-red-700' : ''}`}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isRecording ? 'Stop Recording' : 'Voice Input'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {[
          "I have a headache and fever",
          "What are the symptoms of diabetes?", 
          "How to manage high blood pressure?",
          "Healthy diet recommendations",
          "Exercise tips for beginners",
          "When should I see a doctor?"
        ].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => handleSendMessage(suggestion)}
            className="text-xs hover:bg-accent/50"
          >
            {suggestion}
          </Button>
        ))}
      </div>

      {/* 3D Avatar Section */}
      <div className="mt-6 w-full max-w-4xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-lg border border-slate-200/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              <h3 className="text-lg font-bold text-white text-center">SwasthAI Virtual Assistant</h3>
            </div>
            <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-100">
              <Avatar3D isSpeaking={isAvatarSpeaking} />
            </div>
            {isAvatarSpeaking && (
              <div className="p-3 bg-blue-50 border-t border-blue-100 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 font-medium">Avatar is speaking...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}