'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Wand2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CreateQuizPage() {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [timeLimit, setTimeLimit] = useState('30')
  const [numberOfQuestions, setNumberOfQuestions] = useState('20')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleStartQuiz = () => {
    if (subject && timeLimit && numberOfQuestions) {
      setIsGenerating(true)
      // Simulate quiz generation
      setTimeout(() => {
        router.push(`/student/quiz/take/custom?subject=${encodeURIComponent(subject)}&time=${timeLimit}&questions=${numberOfQuestions}`)
        setIsGenerating(false)
      }, 1500)
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/student/quiz">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Custom Quiz</h1>
          <p className="text-muted-foreground mt-1">Generate a personalized quiz based on your preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="p-8 border border-border space-y-6">
            <form className="space-y-6">
              {/* Subject Input */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="e.g., Mathematics, Physics, Chemistry, Biology..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="h-10 border-border bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the subject or topic you want to practice
                </p>
              </div>

              {/* Time Limit */}
              <div className="space-y-2">
                <Label htmlFor="timeLimit" className="text-sm font-medium text-foreground">
                  Time Limit (minutes) <span className="text-red-500">*</span>
                </Label>
                <Select value={timeLimit} onValueChange={setTimeLimit}>
                  <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Questions */}
              <div className="space-y-2">
                <Label htmlFor="questions" className="text-sm font-medium text-foreground">
                  Number of Questions <span className="text-red-500">*</span>
                </Label>
                <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
                  <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 questions</SelectItem>
                    <SelectItem value="15">15 questions</SelectItem>
                    <SelectItem value="20">20 questions</SelectItem>
                    <SelectItem value="25">25 questions</SelectItem>
                    <SelectItem value="30">30 questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Difficulty Level
                </Label>
                <Select defaultValue="mixed">
                  <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleStartQuiz}
                disabled={!subject || !timeLimit || !numberOfQuestions || isGenerating}
                className="w-full bg-primary hover:bg-primary/90 h-11 gap-2 font-semibold"
              >
                <Wand2 className="w-4 h-4" />
                {isGenerating ? 'Generating Quiz...' : 'Generate & Start Quiz'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <Card className="p-6 border border-border space-y-4">
            <h3 className="font-semibold text-foreground">Quick Tips</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>Enter a specific subject or topic for better results</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>Choose a comfortable time limit for your practice</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>Mix difficulty levels for comprehensive learning</span>
              </li>
            </ul>
          </Card>

          {/* Example Subjects */}
          <Card className="p-6 border border-border space-y-4">
            <h3 className="font-semibold text-foreground">Popular Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'].map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSubject(subj)}
                  className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors"
                >
                  {subj}
                </button>
              ))}
            </div>
          </Card>

          {/* Features */}
          <Card className="p-6 border border-blue-200 bg-blue-50 space-y-3">
            <h3 className="font-semibold text-blue-900">Features</h3>
            <ul className="space-y-2 text-xs text-blue-800">
              <li>✓ AI-generated questions</li>
              <li>✓ Instant feedback</li>
              <li>✓ Performance analytics</li>
              <li>✓ Detailed explanations</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
