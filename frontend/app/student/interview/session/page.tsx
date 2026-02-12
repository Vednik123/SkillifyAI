'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic2, Video, VideoOff, Send, Volume2, Circle } from 'lucide-react'

export default function InterviewSessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [showTabWarning, setShowTabWarning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const interviewType = searchParams.get('type') || 'Technical'
  const subject = searchParams.get('subject') || 'Software Engineer'
  const duration = parseInt(searchParams.get('duration') || '30')

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1
        setTabSwitchCount(newCount)
        setShowTabWarning(true)
        
        if (newCount > 2) {
          alert('You have switched tabs more than 2 times. Your interview will be submitted automatically.')
          handleSubmitInterview()
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
        audio: !isMuted,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setCameraError('Unable to access camera. Please check permissions.')
      setIsCameraOn(false)
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
          handleSubmitInterview()
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

  const handleToggleMicrophone = () => {
    setIsMuted(!isMuted)
  }

  const handleToggleCamera = () => {
    setIsCameraOn(!isCameraOn)
  }

  const handleSubmitAnswer = () => {
    setCurrentQuestion(currentQuestion + 1)
  }

  const handleSubmitInterview = () => {
    router.push('/student/interview/results')
  }

  const handleToggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const handleHearQuestion = () => {
    const utterance = new SpeechSynthesisUtterance('Tell us about your biggest project achievement and how you overcame challenges.')
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      {/* Tab Switch Warning */}
      {showTabWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3 animate-pulse">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          <span className="font-medium">Warning: You switched tabs. Tab switches: {tabSwitchCount}/2</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Interview Practice Session</h1>
            <p className="text-muted-foreground mt-1">{interviewType} Interview - {subject}</p>
          </div>
          <Card className="p-6 border border-primary bg-primary/5">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Time Remaining</p>
              <p className="text-4xl font-bold text-primary font-mono">{formatTime(timeRemaining)}</p>
            </div>
          </Card>
        </div>

        {/* Dual Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Interview Screen - Left */}
          <Card className="p-8 border border-border space-y-6 h-full min-h-[500px] flex flex-col">
            <h3 className="text-xl font-semibold text-foreground">AI Interviewer</h3>
            
            {/* AI Avatar */}
            <div className="flex flex-col items-center justify-center flex-1 space-y-6">
              <div className="relative w-full max-w-xs aspect-square rounded-lg border-4 border-primary bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden flex items-center justify-center">
                <img 
                  src="/interview-practice-interviewer.jpg" 
                  alt="AI Interviewer"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Question */}
              <div className="text-center space-y-4 w-full">
                <p className="text-lg font-medium text-foreground">Question {currentQuestion}</p>
                <p className="text-muted-foreground italic">
                  "Tell us about your biggest project achievement and how you overcame challenges."
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

              {/* Audio indicator */}
              <div className="flex items-center justify-center gap-1 h-8">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${10 + i * 5}px`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Student Camera Screen - Right */}
          <Card className="p-8 border border-border space-y-6 h-full min-h-[500px] flex flex-col">
            <h3 className="text-xl font-semibold text-foreground">Your Camera</h3>
            
            {/* Camera Feed */}
            <div className="flex-1 rounded-lg bg-black flex items-center justify-center relative border-2 border-muted overflow-hidden">
              {isCameraOn ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                      <p className="text-xs text-white text-center px-4">{cameraError}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <VideoOff className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Camera is off</p>
                </div>
              )}
              
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-xs font-medium">Recording</span>
                </div>
              )}
            </div>

            {/* Microphone Status */}
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Mic2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Microphone {isMuted ? 'Muted' : 'Active'}
              </span>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <Button
                onClick={handleToggleMicrophone}
                variant={isMuted ? 'outline' : 'default'}
                className="w-full gap-2"
              >
                <Mic2 className="w-4 h-4" />
                {isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              </Button>
              
              {/* Record Answer Button */}
              <Button
                onClick={handleToggleRecording}
                className={`w-full gap-2 h-10 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}
              >
                <Circle className={`w-4 h-4 ${isRecording ? 'fill-current' : ''}`} />
                {isRecording ? 'Stop Recording' : 'Record Answer'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Answer Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleSubmitAnswer}
            className="gap-2 bg-green-600 hover:bg-green-700 h-12 px-8 text-base text-white"
          >
            <Send className="w-5 h-5" />
            Submit Answer
          </Button>
          <Button
            onClick={handleSubmitInterview}
            className="gap-2 bg-primary hover:bg-primary/90 h-12 px-8 text-base"
          >
            <Send className="w-5 h-5" />
            End Interview
          </Button>
        </div>

        {/* Instructions */}
        <Card className="p-6 border border-blue-200 bg-blue-50">
          <h3 className="font-semibold text-blue-900 mb-3">Interview Guidelines</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Ensure your camera is on and microphone is active</li>
            <li>• Look at the camera when speaking</li>
            <li>• Speak clearly and at a moderate pace</li>
            <li>• Answer each question thoroughly</li>
            <li>• Click "Submit Answer" to move to next question</li>
            <li>• Click "End Interview" when finished</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
