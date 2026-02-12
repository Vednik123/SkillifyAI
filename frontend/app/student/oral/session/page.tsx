'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic2, Square, SkipForward, Send, Volume2 } from 'lucide-react'

export default function OralSessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [totalQuestions] = useState(5)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [showTabWarning, setShowTabWarning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const subject = searchParams.get('subject') || 'General Knowledge'
  const duration = parseInt(searchParams.get('duration') || '10')

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1
        setTabSwitchCount(newCount)
        setShowTabWarning(true)
        
        if (newCount > 2) {
          alert('You have switched tabs more than 2 times. Your oral exam will be submitted automatically.')
          handleSubmitOralExam()
        }
        
        setTimeout(() => setShowTabWarning(false), 3000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [tabSwitchCount])

  // Initialize camera
  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setCameraError('Unable to access camera. Please check permissions.')
      console.log('[v0] Camera access error:', err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  // Initialize timer
  useEffect(() => {
    setTimeRemaining(duration * 60)
  }, [duration])

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || timeRemaining <= 0) return
    
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false)
          handleSubmitOralExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartRecording = () => {
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1)
      setIsRecording(false)
    }
  }

  const handleSubmitOralExam = () => {
    router.push('/student/quiz/results?type=oral')
  }

  const handleHearQuestion = () => {
    // Simulate speaking the question using Web Speech API
    const utterance = new SpeechSynthesisUtterance('Can you tell us about your experience with public speaking?')
    window.speechSynthesis.speak(utterance)
  }

  // Wave animation component
  const WaveAnimation = () => (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-primary rounded-full animate-pulse"
          style={{
            height: `${20 + i * 10}px`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      {/* Tab Switch Warning */}
      {showTabWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3 animate-pulse">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          <span className="font-medium">Warning: You switched tabs. Tab switches: {tabSwitchCount}/2</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Timer */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Oral Practice Session</h1>
            <p className="text-muted-foreground mt-1">Subject: {subject}</p>
          </div>
          <Card className="p-6 border border-primary bg-primary/5">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Time Remaining</p>
              <p className="text-4xl font-bold text-primary font-mono">{formatTime(timeRemaining)}</p>
            </div>
          </Card>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion} of {totalQuestions}
          </p>
          <div className="flex gap-1">
            {[...Array(totalQuestions)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-colors ${
                  i < currentQuestion ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-12 border border-border space-y-8">
          {/* Camera and AI Avatar Row */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Student Camera */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-full aspect-square rounded-lg border-2 border-primary bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-xs text-white text-center px-4">{cameraError}</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Your Camera</p>
            </div>

            {/* AI Avatar Image */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-full aspect-square rounded-lg border-2 border-primary bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                <img 
                  src="/oral-practice-speaker.jpg" 
                  alt="AI Speaker"
                  className="w-full h-full object-cover"
                />
                {isRecording && (
                  <div className="absolute inset-0 border-2 border-primary animate-pulse rounded-lg bg-green-500/10" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">AI Speaker</p>
            </div>
          </div>

          {/* Question Display */}
          <div className="text-center space-y-4">
            <p className="text-xl text-muted-foreground">
              "Can you tell us about your experience with public speaking?"
            </p>
            <Button 
              onClick={handleHearQuestion}
              variant="outline"
              className="mx-auto gap-2 bg-transparent"
            >
              <Volume2 className="w-4 h-4" />
              Hear Question Again
            </Button>
          </div>

          {/* Wave Animation */}
          <WaveAnimation />

          {/* Recording Controls */}
          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <Button
                onClick={handleStartRecording}
                className="gap-2 bg-primary hover:bg-primary/90 h-12 px-6 text-base"
              >
                <Mic2 className="w-5 h-5" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={handleStopRecording}
                className="gap-2 bg-red-600 hover:bg-red-700 h-12 px-6 text-base text-white"
              >
                <Square className="w-5 h-5" />
                Stop Recording
              </Button>
            )}
          </div>

          {/* Submit Answer Button */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={currentQuestion < totalQuestions ? handleNextQuestion : handleSubmitOralExam}
              className="gap-2 bg-green-600 hover:bg-green-700 h-12 px-8 text-base text-white"
            >
              {currentQuestion < totalQuestions ? (
                <>
                  <SkipForward className="w-5 h-5" />
                  Submit Answer & Next
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Oral Exam
                </>
              )}
            </Button>
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="flex justify-center items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <p className="text-sm text-red-600 font-medium">Recording in progress...</p>
            </div>
          )}
        </Card>

        {/* Instructions */}
        <Card className="p-6 border border-blue-200 bg-blue-50">
          <h3 className="font-semibold text-blue-900 mb-3">Instructions</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Click "Start Recording" when ready to answer</li>
            <li>• Speak clearly and naturally</li>
            <li>• Click "Stop Recording" when finished</li>
            <li>• Click "Next Question" to proceed to the next question</li>
            <li>• Session will auto-submit when time runs out</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
