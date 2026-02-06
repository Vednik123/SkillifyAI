'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Plus, Play } from 'lucide-react'

const scheduledQuizzes = [
  {
    id: 1,
    subject: 'Mathematics',
    topic: 'Calculus - Integration',
    scheduledBy: 'Prof. Smith',
    date: 'March 20, 2024',
    time: '10:00 AM',
    duration: '60 minutes',
    difficulty: 'Intermediate',
  },
  {
    id: 2,
    subject: 'Physics',
    topic: 'Quantum Mechanics',
    scheduledBy: 'Prof. Johnson',
    date: 'March 22, 2024',
    time: '2:00 PM',
    duration: '90 minutes',
    difficulty: 'Advanced',
  },
  {
    id: 3,
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    scheduledBy: 'Prof. Williams',
    date: 'March 25, 2024',
    time: '11:00 AM',
    duration: '75 minutes',
    difficulty: 'Intermediate',
  },
]

export default function QuizPage() {
  return (
    <div className="p-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI-Powered Quizzes</h1>
        <p className="text-muted-foreground mt-2">Take scheduled exams or create your own custom quiz</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 border border-border hover:shadow-lg transition-shadow cursor-pointer group">
          <Link href="/student/quiz/scheduled">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Scheduled Exams</h3>
              <p className="text-sm text-muted-foreground">
                Take quizzes scheduled by your faculty with AI proctoring
              </p>
              <div className="pt-2">
                <span className="text-sm font-semibold text-blue-600">
                  {scheduledQuizzes.length} quiz{scheduledQuizzes.length !== 1 ? 'zes' : ''} available
                </span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                View Exams
              </Button>
            </div>
          </Link>
        </Card>

        <Card className="p-8 border border-border hover:shadow-lg transition-shadow cursor-pointer group">
          <Link href="/student/quiz/create">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Create Custom Quiz</h3>
              <p className="text-sm text-muted-foreground">
                Generate a custom quiz by specifying subject and topics
              </p>
              <div className="pt-2">
                <span className="text-sm font-semibold text-green-600">
                  Practice anytime
                </span>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-4">
                Create Quiz
              </Button>
            </div>
          </Link>
        </Card>
      </div>

      {/* Scheduled Quizzes Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Upcoming Scheduled Exams</h2>

        {scheduledQuizzes.length > 0 ? (
          <div className="space-y-4">
            {scheduledQuizzes.map((quiz) => (
              <Link key={quiz.id} href={`/student/quiz/take/${quiz.id}`}>
                <Card className="p-6 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {quiz.topic}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {quiz.subject} • Scheduled by {quiz.scheduledBy}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-white bg-primary px-3 py-1 rounded-full">
                          {quiz.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{quiz.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{quiz.time}</span>
                        </div>
                        <span>{quiz.duration}</span>
                      </div>
                    </div>

                    <Button className="ml-4 bg-primary hover:bg-primary/90 gap-2">
                      <Play className="w-4 h-4" />
                      Start
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 border border-border text-center">
            <p className="text-muted-foreground">No scheduled exams at the moment. Check back soon!</p>
          </Card>
        )}
      </section>

      {/* Recent Quizzes */}
      <section className="space-y-6 border-t border-border pt-8">
        <h2 className="text-2xl font-semibold text-foreground">Recent Quiz Attempts</h2>
        <Card className="p-12 border border-border text-center">
          <p className="text-muted-foreground">You haven't taken any quizzes yet. Get started by taking a scheduled exam or creating a custom quiz.</p>
        </Card>
      </section>
    </div>
  )
}
