'use client'

import React from "react"

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, AlertTriangle, X } from 'lucide-react'

interface Message {
  id: string
  sender: 'student' | 'mentor'
  text: string
  timestamp: Date
}

const STRESS_KEYWORDS = [
  'stressed',
  'depressed',
  'overwhelmed',
  'anxious',
  'pressure',
  'cant handle',
  'give up',
  'hopeless',
  'failure',
  'scared',
  'worried',
  'struggling',
  'confused',
  'lost',
  'nothing is working',
  'too much',
  'impossible',
]

const MENTOR_RESPONSES = {
  stress: [
    "I can see you're feeling stressed. That's completely normal. Let's break things down into smaller, manageable tasks. What's bothering you the most right now?",
    "It sounds like you're carrying a heavy load. Remember, it's okay to take breaks and practice self-care. Would it help to talk about what's causing this pressure?",
    "I'm here to listen and support you. Stress is something many students experience. Let's explore what's happening and find ways to manage it together.",
  ],
  encouragement: [
    "You're doing great! Remember that challenges are opportunities to grow. I believe in your ability to overcome this.",
    "Every expert was once a beginner. The fact that you're reaching out for support shows strength and determination.",
    "Progress, not perfection. You're on the right path. Keep going!",
  ],
  support: [
    "I'm here for you. Whatever you're feeling, let's talk about it. You're not alone in this journey.",
    "Your wellbeing matters. Let's work through this together and find solutions that help you feel better.",
    "Thank you for sharing. Opening up about your feelings is the first step towards feeling better.",
  ],
  default: [
    "I understand. Tell me more about how you're feeling. What would help you right now?",
    "That sounds challenging. Would you like to talk more about it?",
    "I'm listening. What's on your mind?",
  ],
}

export default function AIMentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'mentor',
      text: "Hi there! I'm your AI Mentor. I'm here to listen and support you. Feel free to share anything that's on your mind - whether it's stress, confusion, pressure, or just need someone to talk to. How are you feeling today?",
      timestamp: new Date(),
    },
  ])

  const [inputValue, setInputValue] = useState('')
  const [isAtRisk, setIsAtRisk] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [stressCount, setStressCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectStress = (text: string): boolean => {
    const lowerText = text.toLowerCase()
    const foundKeywords = STRESS_KEYWORDS.filter((keyword) => lowerText.includes(keyword))
    return foundKeywords.length > 0
  }

  const getMentorResponse = (studentMessage: string): string => {
    const hasStress = detectStress(studentMessage)

    if (hasStress) {
      const stressResponses = MENTOR_RESPONSES.stress
      return stressResponses[Math.floor(Math.random() * stressResponses.length)]
    }

    if (
      studentMessage.toLowerCase().includes('thank') ||
      studentMessage.toLowerCase().includes('help') ||
      studentMessage.toLowerCase().includes('appreciate')
    ) {
      return MENTOR_RESPONSES.support[Math.floor(Math.random() * MENTOR_RESPONSES.support.length)]
    }

    return MENTOR_RESPONSES.default[Math.floor(Math.random() * MENTOR_RESPONSES.default.length)]
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add student message
    const studentMessage: Message = {
      id: Date.now().toString(),
      sender: 'student',
      text: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, studentMessage])

    // Check for stress
    const hasStress = detectStress(inputValue)
    if (hasStress) {
      setStressCount((prev) => prev + 1)
      if (stressCount + 1 >= 2 && !isAtRisk) {
        setIsAtRisk(true)
        setShowNotification(true)
      }
    }

    // Add mentor response
    setTimeout(() => {
      const mentorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'mentor',
        text: getMentorResponse(inputValue),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, mentorResponse])
    }, 800)

    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AI Mentor</h1>
        </div>
        <p className="text-muted-foreground">
          Your personal mentor for emotional support, guidance, and wellbeing
        </p>
      </div>

      {/* At-Risk Notification */}
      {showNotification && isAtRisk && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">Alert: Emotional Wellbeing Check</h3>
            <p className="text-sm text-amber-800 mt-1">
              We've noticed you may be experiencing emotional stress. We've automatically notified your faculty and parent about this. Please take care of yourself and don't hesitate to reach out for support.
            </p>
            <p className="text-xs text-amber-700 mt-2 font-medium">
              Notifications sent to: Faculty & Parents
            </p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="flex-shrink-0 text-amber-600 hover:text-amber-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Chat Panel */}
        <Card className="border border-border lg:col-span-3 flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm px-4 py-3 rounded-lg ${
                    message.sender === 'student'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-secondary text-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className={`text-xs mt-1 block ${message.sender === 'student' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {message.timestamp.getHours().toString().padStart(2, '0')}:{message.timestamp.getMinutes().toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1 h-10 border-border bg-background"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter to send • Your wellbeing is important to us
            </p>
          </div>
        </Card>

        {/* Info Panel */}
        <div className="space-y-4">
          {/* Status Card */}
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-3">Your Status</h3>
            <div className={`px-3 py-2 rounded-lg text-sm font-medium ${isAtRisk ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-green-50 text-green-900 border border-green-200'}`}>
              {isAtRisk ? '⚠️ At-Risk' : '✓ Doing Well'}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {isAtRisk
                ? 'We\'ve detected signs of emotional stress. Support has been notified.'
                : 'Everything seems to be going well. Keep taking care of yourself!'}
            </p>
          </Card>

          {/* How to Use */}
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-3">How I Can Help</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Share your feelings and concerns</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Get supportive guidance</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Discuss stress and pressure</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Find coping strategies</span>
              </li>
            </ul>
          </Card>

          {/* Important Note */}
          <Card className="p-6 border border-amber-200 bg-amber-50">
            <h4 className="font-semibold text-amber-900 mb-2 text-sm">Important</h4>
            <p className="text-xs text-amber-800">
              I'm an AI mentor for emotional support and guidance, not a therapist. If you're experiencing serious mental health concerns, please reach out to a professional counselor.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
