'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { ChevronLeft, Download, Share2, BookOpen, ExternalLink } from 'lucide-react'

const analyticsData = [
  { category: 'Algebra', score: 85 },
  { category: 'Geometry', score: 78 },
  { category: 'Calculus', score: 92 },
  { category: 'Statistics', score: 88 },
]

const performanceHistory = [
  { name: 'Quiz 1', score: 75 },
  { name: 'Quiz 2', score: 82 },
  { name: 'Quiz 3', score: 88 },
  { name: 'Quiz 4', score: 92 },
  { name: 'Current', score: 92 },
]

const answers = [
  {
    id: 1,
    question: 'What is the derivative of x² + 3x + 5?',
    yourAnswer: '2x + 3',
    correctAnswer: '2x + 3',
    isCorrect: true,
  },
  {
    id: 2,
    question: 'Which of the following is a prime number?',
    yourAnswer: '21',
    correctAnswer: '17',
    isCorrect: false,
    explanation: 'A prime number is only divisible by 1 and itself. 17 is the only prime in the options.',
  },
  {
    id: 3,
    question: 'Solve: 3x + 7 = 22',
    yourAnswer: 'x = 5',
    correctAnswer: 'x = 5',
    isCorrect: true,
  },
  {
    id: 4,
    question: 'What is the area of a circle with radius 5?',
    yourAnswer: 'πr²',
    correctAnswer: '25π',
    isCorrect: false,
    explanation: 'The area formula is A = πr². With r = 5, A = π(5)² = 25π.',
  },
  {
    id: 5,
    question: 'Simplify: (x + 2)² - (x - 2)²',
    yourAnswer: '8x',
    correctAnswer: '8x',
    isCorrect: true,
  },
]

const correctCount = answers.filter((a) => a.isCorrect).length
const percentage = Math.round((correctCount / answers.length) * 100)

export default function QuizResultsPage() {
  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/student/quiz">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quiz Results & Analytics</h1>
          <p className="text-muted-foreground mt-1">Mathematics - March 20, 2024</p>
        </div>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 border border-border bg-gradient-to-br from-green-50 to-background">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Your Score</p>
            <p className="text-5xl font-bold text-green-600">{percentage}%</p>
            <p className="text-sm text-muted-foreground">{correctCount}/{answers.length} correct</p>
          </div>
        </Card>

        <Card className="p-8 border border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Time Taken</p>
            <p className="text-3xl font-bold text-foreground">45 min</p>
            <p className="text-sm text-muted-foreground">Out of 60 minutes</p>
          </div>
        </Card>

        <Card className="p-8 border border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Performance</p>
            <p className="text-3xl font-bold text-primary">Excellent</p>
            <p className="text-sm text-muted-foreground">Top 10% of all attempts</p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="p-6 border border-border">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Performance by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Progress History */}
        <Card className="p-6 border border-border">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Your Progress</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Learning Resources */}
      <Card className="p-8 border border-blue-200 bg-blue-50 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-900">Learn More on These Topics</h3>
            <p className="text-sm text-blue-800">Explore these resources to strengthen your understanding</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {['YouTube Tutorials on Prime Numbers', 'Khan Academy - Prime Numbers', 'Online Math Solver'].map((resource, idx) => (
            <Button key={idx} variant="outline" className="justify-between h-auto py-2 bg-white hover:bg-white border-blue-300">
              <span className="text-left text-sm">{resource}</span>
              <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2" />
            </Button>
          ))}
        </div>
      </Card>

      {/* Detailed Answers */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Detailed Answer Review</h2>
          <p className="text-muted-foreground">Review your answers and learn from mistakes</p>
        </div>

        <div className="space-y-4">
          {answers.map((answer, idx) => (
            <Card
              key={answer.id}
              className={`p-6 border-2 transition-all ${
                answer.isCorrect
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="space-y-4">
                {/* Question */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Question {idx + 1}</p>
                  <p className="text-lg font-medium text-foreground">{answer.question}</p>
                </div>

                {/* Answers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-t border-b border-current border-opacity-10">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-semibold">YOUR ANSWER</p>
                    <p className={`text-sm font-medium ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {answer.yourAnswer}
                    </p>
                  </div>
                  {!answer.isCorrect && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-semibold">CORRECT ANSWER</p>
                      <p className="text-sm font-medium text-green-700">{answer.correctAnswer}</p>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    answer.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {answer.isCorrect ? '✓' : '✗'}
                  </div>
                  <span className={`font-semibold ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                {/* Explanation */}
                {answer.explanation && (
                  <div className="bg-white/50 rounded p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">EXPLANATION</p>
                    <p className="text-sm text-foreground">{answer.explanation}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center py-8">
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
        <Link href="/student/dashboard">
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Faculty Evaluation Option */}
      <Card className="p-6 border border-yellow-200 bg-yellow-50 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-yellow-900">Not Satisfied with AI Evaluation?</h3>
            <p className="text-sm text-yellow-800">Request your faculty to review your answers manually</p>
          </div>
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
          Send for Faculty Review
        </Button>
      </Card>
    </div>
  )
}
