'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ChevronLeft, Play, X } from 'lucide-react'

const scheduledQuizzes = [
  {
    id: 1,
    subject: 'Mathematics',
    topic: 'Calculus - Integration',
    scheduledBy: 'Prof. Smith',
    date: 'March 20, 2024',
    time: '10:00 AM',
    duration: '60 minutes',
    questions: 30,
    difficulty: 'Intermediate',
    status: 'upcoming',
  },
  {
    id: 2,
    subject: 'Physics',
    topic: 'Quantum Mechanics',
    scheduledBy: 'Prof. Johnson',
    date: 'March 22, 2024',
    time: '2:00 PM',
    duration: '90 minutes',
    questions: 40,
    difficulty: 'Advanced',
    status: 'upcoming',
  },
  {
    id: 3,
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    scheduledBy: 'Prof. Williams',
    date: 'March 25, 2024',
    time: '11:00 AM',
    duration: '75 minutes',
    questions: 35,
    difficulty: 'Intermediate',
    status: 'upcoming',
  },
]

export default function ScheduledQuizzesPage() {
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<typeof scheduledQuizzes[0] | null>(null)

  const handleViewDetails = (quiz: typeof scheduledQuizzes[0]) => {
    setSelectedQuiz(quiz)
    setShowDetailsModal(true)
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
          <h1 className="text-3xl font-bold text-foreground">Scheduled Exams</h1>
          <p className="text-muted-foreground mt-1">Quizzes scheduled by your faculty</p>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scheduledQuizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="p-8 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{quiz.topic}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{quiz.subject}</p>
                  </div>
                  <span className="text-xs font-semibold text-white bg-primary px-3 py-1 rounded-full">
                    {quiz.difficulty}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">by {quiz.scheduledBy}</p>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{quiz.date}</span>
                  </div>
                  <p className="text-sm text-foreground ml-6">{quiz.time}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{quiz.duration}</span>
                  </div>
                  <p className="text-sm text-foreground ml-6">{quiz.questions} questions</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href={`/student/quiz/take/${quiz.id}`} className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 h-10 gap-2">
                    <Play className="w-4 h-4" />
                    Start Exam
                  </Button>
                </Link>
                <Button 
                  onClick={() => handleViewDetails(quiz)}
                  variant="outline" 
                  className="w-full h-10 bg-transparent"
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card className="p-6 border border-blue-200 bg-blue-50">
        <h3 className="font-semibold text-blue-900 mb-2">Important:</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Make sure you have a stable internet connection</li>
          <li>• Enable camera and microphone for proctoring</li>
          <li>• Take the exam in a quiet, well-lit environment</li>
          <li>• Do not switch tabs or windows during the exam</li>
          <li>• Your face must be visible throughout the exam</li>
        </ul>
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl p-8 border border-border">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedQuiz.topic}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedQuiz.subject}</p>
                </div>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-2xl text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Scheduled By</p>
                  <p className="font-semibold text-foreground">{selectedQuiz.scheduledBy}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                  <p className="font-semibold text-foreground">{selectedQuiz.difficulty}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Questions</p>
                  <p className="font-semibold text-foreground">{selectedQuiz.questions}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold text-foreground">{selectedQuiz.duration}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Exam Date:</strong> {selectedQuiz.date} at {selectedQuiz.time}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Description:</strong> This is a comprehensive exam covering key topics from the course material.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Link href={`/student/quiz/take/${selectedQuiz.id}`} className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90 gap-2">
                    <Play className="w-4 h-4" />
                    Start Exam
                  </Button>
                </Link>
                <Button 
                  onClick={() => setShowDetailsModal(false)}
                  variant="outline" 
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
