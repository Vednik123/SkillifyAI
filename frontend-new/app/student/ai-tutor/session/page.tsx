'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Volume2, RotateCcw, Square } from 'lucide-react'
import Link from 'next/link'

export default function AITutorSessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subject = searchParams.get('subject') || 'Topic'
  const duration = parseInt(searchParams.get('duration') || '30')

  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const explanationSteps = [
    {
      title: 'Introduction',
      content: `Today we'll explore "${subject}" in detail. This is a fundamental concept that will help you understand many advanced topics.`,
      example: 'We\'ll break this down into simple, manageable steps.',
    },
    {
      title: 'Core Concept',
      content: `The main idea behind ${subject} is that... Let me explain the key principles and how they work together.`,
      example: 'Think of it like building blocks - each concept builds on the previous one.',
    },
    {
      title: 'Practical Application',
      content: `Now let\'s see how ${subject} applies in real-world scenarios. This is where you\'ll see the true power of this concept.`,
      example: 'For instance, in practical situations, we often encounter cases where...',
    },
    {
      title: 'Advanced Insights',
      content: 'Beyond the basics, there are some advanced considerations and nuances to be aware of.',
      example: 'One common mistake students make is overlooking the edge cases.',
    },
    {
      title: 'Summary',
      content: `To summarize, "${subject}" is important because it forms the foundation for many other concepts. Remember the key points we covered.`,
      example: 'Practice these concepts regularly to master them.',
    },
  ]

  const currentExplanation = explanationSteps[currentStep - 1]

  const handleNextStep = () => {
    if (currentStep < explanationSteps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleRepeat = () => {
    setCurrentStep(1)
  }

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(`${currentExplanation.title}. ${currentExplanation.content}`)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/student/ai-tutor">
            <Button variant="outline" size="icon" className="bg-transparent">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{subject}</h1>
            <p className="text-sm text-muted-foreground">AI Tutor Session</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{formatTime(timeLeft)}</p>
          <p className="text-xs text-muted-foreground">Time remaining</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Panel - AI Avatar */}
        <Card className="p-8 border border-border lg:col-span-1 flex flex-col items-center justify-center bg-gradient-to-b from-secondary/50 to-background">
          <div className="text-center space-y-4 w-full">
            {/* Video/Image Avatar */}
            <div className={`mx-auto w-full aspect-square rounded-lg bg-black overflow-hidden relative transition-all ${isPlaying ? 'ring-4 ring-primary/30' : ''}`}>
              <img 
                src="/ai-tutor-video.jpg" 
                alt="AI Tutor"
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-0 h-0 border-l-6 border-r-0 border-t-4 border-b-4 border-l-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1">
              <p className="font-semibold text-foreground">AI Tutor</p>
              <p className={`text-sm transition-colors ${isPlaying ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                {isPlaying ? '🎤 Speaking...' : 'Ready'}
              </p>
            </div>

            {/* Speak Button */}
            <Button
              onClick={handleSpeak}
              className="w-full gap-2 bg-primary hover:bg-primary/90"
            >
              <Volume2 className="w-4 h-4" />
              Hear Explanation
            </Button>
          </div>
        </Card>

        {/* Right Panel - Whiteboard */}
        <Card className="p-8 border border-border lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Step {currentStep}: {currentExplanation.title}
              </h2>
              <p className="text-sm text-muted-foreground">{currentStep} of {explanationSteps.length}</p>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(currentStep / explanationSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Whiteboard Content */}
          <div className="bg-white border-2 border-dashed border-primary/30 rounded-lg p-6 min-h-64 space-y-4 animate-fadeIn">
            <p className="text-foreground leading-relaxed">{currentExplanation.content}</p>
            
            {currentExplanation.example && (
              <div className="bg-primary/5 border-l-4 border-primary pl-4 py-2">
                <p className="text-sm font-medium text-primary">Example:</p>
                <p className="text-sm text-foreground mt-1">{currentExplanation.example}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <Button
              onClick={handleRepeat}
              variant="outline"
              className="flex-1 gap-2 bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
              Repeat from Start
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={currentStep >= explanationSteps.length}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {currentStep >= explanationSteps.length ? 'Session Complete' : 'Next Step'}
            </Button>
          </div>

          {currentStep >= explanationSteps.length && (
            <Button
              onClick={() => router.push('/student/ai-tutor')}
              className="w-full gap-2 bg-green-600 hover:bg-green-700"
            >
              <Square className="w-4 h-4" />
              End Session
            </Button>
          )}
        </Card>
      </div>
    </div>
  )
}
