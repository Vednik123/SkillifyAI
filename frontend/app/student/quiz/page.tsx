'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Plus, Play } from 'lucide-react'

export default function QuizPage() {
  const [scheduledQuizzes, setScheduledQuizzes] = useState<any[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/api/student/exams/scheduled', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setScheduledQuizzes(data))
      .catch(console.error)
  }, [])

  return (
    <div className="p-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          AI-Powered Quizzes
        </h1>
        <p className="text-muted-foreground mt-2">
          Take scheduled exams or create your own custom quiz
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 border border-border hover:shadow-lg transition-shadow cursor-pointer group">
          <Link href="/student/quiz/scheduled">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>

              <h3 className="text-xl font-semibold">
                Scheduled Exams
              </h3>

              <p className="text-sm text-muted-foreground">
                Take quizzes scheduled by your faculty with AI proctoring
              </p>

              <span className="text-sm font-semibold text-blue-600">
                {scheduledQuizzes.length} exam
                {scheduledQuizzes.length !== 1 ? 's' : ''} available
              </span>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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

              <h3 className="text-xl font-semibold">
                Create Custom Quiz
              </h3>

              <p className="text-sm text-muted-foreground">
                Generate a custom quiz by specifying subject and topics
              </p>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Create Quiz
              </Button>
            </div>
          </Link>
        </Card>
      </div>

      {/* Scheduled Exams List */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Upcoming Scheduled Exams
        </h2>

        {scheduledQuizzes.length > 0 ? (
          scheduledQuizzes.map((quiz: any) => (
            <Link
              key={quiz._id}
              href={`/student/quiz/take/${quiz._id}`}
            >
              <Card className="p-6 hover:shadow-lg cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {quiz.subject} • {quiz.faculty?.name}
                    </p>

                    <div className="flex gap-4 text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(
                          quiz.scheduledAt
                        ).toLocaleDateString()}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {quiz.duration} mins
                      </span>
                    </div>
                  </div>

                  <Button className="gap-2">
                    <Play size={16} />
                    Start
                  </Button>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="p-10 text-center text-muted-foreground">
            No scheduled exams available
          </Card>
        )}
      </section>
    </div>
  )
}