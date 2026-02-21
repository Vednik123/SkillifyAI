'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Plus, Play, FileText } from 'lucide-react'

export default function QuizPage() {
  const [scheduledQuizzes, setScheduledQuizzes] = useState<any[]>([])
  const [pastAttempts, setPastAttempts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch scheduled exams
        const scheduledRes = await fetch('http://localhost:5000/api/student/exams/scheduled', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (scheduledRes.ok) {
          const scheduledData = await scheduledRes.json()
          setScheduledQuizzes(Array.isArray(scheduledData) ? scheduledData : [])
        }
      } catch (err) {
        console.error('Error fetching scheduled exams:', err)
      }

      try {
        // Fetch past quiz attempts
        const pastRes = await fetch('http://localhost:5000/api/quiz/result/list', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (pastRes.ok) {
          const pastData = await pastRes.json()
          console.log('Past attempts data:', pastData) // for debugging
          setPastAttempts(Array.isArray(pastData) ? pastData : [])
        }
      } catch (err) {
        console.error('Error fetching past attempts:', err)
      }

      setLoading(false)
    }

    if (token) {
      fetchData()
    }
  }, [token])

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

      {/* Previous Attempts */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Previous Quiz Reports</h2>

        {pastAttempts.length > 0 ? (
          <div className="grid gap-4">
            {pastAttempts.map((item: any) => {
              const percentage = item.totalQuestions && item.totalQuestions > 0 
                ? Math.round((item.score / item.totalQuestions) * 100) 
                : item.score || 0;
              const displayScore = item.score;
              const displayTotal = item.totalQuestions || 0;
              
              return (
                <Card key={item.attemptId} className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-lg text-foreground">
                          {item.quizTitle || (item.quizType === 'CUSTOM' ? 'Custom AI Quiz' : 'Scheduled Exam')}
                        </h3>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>📅 {new Date(item.submittedAt).toLocaleString()}</p>
                        <p>❓ {item.totalQuestions} Questions</p>
                      </div>
                    </div>

                    <div className="text-right space-y-3">
                      <div>
                        <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
                        <div className="text-sm text-muted-foreground">
                          {displayScore}/{displayTotal} marks
                        </div>
                      </div>
                      <Link href={`/student/quiz/results?attemptId=${item.attemptId}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full gap-2">
                          <FileText size={16} />
                          View Report
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center text-muted-foreground border-dashed">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-base font-medium">No previous quiz reports yet</p>
            <p className="text-sm mt-2">Your quiz attempts will appear here after you complete them</p>
          </Card>
        )}
      </section>
    </div>
  )
}