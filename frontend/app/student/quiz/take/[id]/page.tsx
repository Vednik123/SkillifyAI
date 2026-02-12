'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Camera, Clock, AlertTriangle, CheckCircle, Volume2 } from 'lucide-react'

const quizQuestions = [
  {
    id: 1,
    question: 'What is the derivative of x² + 3x + 5?',
    options: ['2x + 3', '2x + 5', 'x + 3', '2x'],
    correct: 0,
  },
  {
    id: 2,
    question: 'Which of the following is a prime number?',
    options: ['15', '21', '17', '20'],
    correct: 2,
  },
  {
    id: 3,
    question: 'Solve: 3x + 7 = 22',
    options: ['x = 5', 'x = 3', 'x = 6', 'x = 4'],
    correct: 0,
  },
  {
    id: 4,
    question: 'What is the area of a circle with radius 5?',
    options: ['25π', '10π', 'πr²', '15π'],
    correct: 0,
  },
  {
    id: 5,
    question: 'Simplify: (x + 2)² - (x - 2)²',
    options: ['4x', '8x', '0', '16'],
    correct: 1,
  },
]

export default function QuizTakePage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(quizQuestions.length).fill(null))
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 1 hour in seconds
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0)
  const [cameraActive, setCameraActive] = useState(true)
  const [showTabWarning, setShowTabWarning] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newWarnings = tabSwitchWarnings + 1
        setTabSwitchWarnings(newWarnings)
        setShowTabWarning(true)
        setTimeout(() => setShowTabWarning(false), 3000)

        if (newWarnings > 2) {
          alert('You have switched tabs more than 2 times. Your quiz will be submitted automatically.')
          handleSubmitQuiz()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [tabSwitchWarnings])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = optionIndex
    setSelectedAnswers(newAnswers)
  }

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true)
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (quizSubmitted) {
    const score = selectedAnswers.filter((answer, idx) => answer === quizQuestions[idx].correct).length
    const percentage = Math.round((score / quizQuestions.length) * 100)

    return (
      <div className="h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="max-w-2xl w-full p-12 border border-border text-center space-y-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
            <h1 className="text-4xl font-bold text-foreground">Quiz Submitted!</h1>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">Your quiz has been submitted successfully.</p>
              <div className="bg-primary/10 rounded-lg p-8">
                <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                <p className="text-5xl font-bold text-primary">{percentage}%</p>
                <p className="text-muted-foreground mt-2">{score} out of {quizQuestions.length} correct</p>
              </div>
            </div>
            <div className="space-y-3">
              <Link href="/student/quiz/results" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 h-11">
                  View Detailed Results
                </Button>
              </Link>
              <Link href="/student/dashboard" className="block">
                <Button variant="outline" className="w-full h-11 bg-transparent">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Main Quiz Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg text-foreground">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${cameraActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {cameraActive ? 'Camera Active' : 'Camera Off'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">Face Verified</span>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {quizQuestions.length}</span>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Progress</span>
                <span className="text-sm text-muted-foreground">{currentQuestion + 1}/{quizQuestions.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question Card */}
            <Card className="p-8 border border-border space-y-8">
              <h2 className="text-2xl font-semibold text-foreground leading-relaxed">
                {question.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left font-medium ${
                      selectedAnswers[currentQuestion] === idx
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedAnswers[currentQuestion] === idx
                            ? 'border-primary bg-primary'
                            : 'border-border'
                        }`}
                      >
                        {selectedAnswers[currentQuestion] === idx && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="min-w-32 bg-transparent"
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {quizQuestions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      idx === currentQuestion
                        ? 'bg-primary text-primary-foreground'
                        : selectedAnswers[idx] !== null
                          ? 'bg-green-100 text-green-700'
                          : 'bg-secondary text-foreground hover:bg-secondary'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {currentQuestion === quizQuestions.length - 1 ? (
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  className="min-w-32 bg-primary hover:bg-primary/90"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="min-w-32 bg-primary hover:bg-primary/90"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Widget */}
      <div className="w-72 border-l border-border bg-card p-4 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground">Camera Feed</h3>

        {/* Camera Preview */}
        <div className="flex-1 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden border border-gray-700">
          {cameraActive ? (
            <>
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                <div className="w-32 h-40 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-2 border-primary/30">
                  <Camera className="w-12 h-12 text-gray-600" />
                </div>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded text-xs text-white">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Live
              </div>
            </>
          ) : (
            <Camera className="w-12 h-12 text-gray-600" />
          )}
        </div>

        {/* Controls */}
        <Button
          onClick={() => setCameraActive(!cameraActive)}
          variant={cameraActive ? 'default' : 'destructive'}
          size="sm"
          className="w-full"
        >
          {cameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
        </Button>
      </div>

      {/* Tab Switch Warning */}
      {showTabWarning && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-300 rounded-lg p-4 max-w-sm animate-in slide-in-from-top">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Tab Switch Detected</p>
              <p className="text-sm text-red-800">Warning {tabSwitchWarnings}/2: Do not switch tabs during the exam</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
          <div className="space-y-3">
            <AlertDialogDescription>
              Are you sure you want to submit the quiz? This action cannot be undone.
            </AlertDialogDescription>
            <div className="text-sm text-muted-foreground">
              You have answered {selectedAnswers.filter((a) => a !== null).length} out of {quizQuestions.length} questions.
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitQuiz} className="bg-primary hover:bg-primary/90">
              Submit Quiz
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
