'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ReviewPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'oral' | 'quiz'>('oral')
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (activeTab !== 'oral') return

    const fetchExams = async () => {
      try {
        const res = await fetch(`${API_URL}/faculty/analytics/oral-exams`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        const data = await res.json()
        setExams(data)
      } catch (error) {
        console.error('Error fetching exams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [activeTab])

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Exam Review Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4">
        <Button
          variant={activeTab === 'oral' ? 'default' : 'outline'}
          onClick={() => setActiveTab('oral')}
        >
          Oral Exams
        </Button>

        <Button
          variant={activeTab === 'quiz' ? 'default' : 'outline'}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz Exams
        </Button>
      </div>

      {/* Oral Exams */}
      {activeTab === 'oral' && (
        <div className="space-y-4">
          {loading ? (
            <p>Loading exams...</p>
          ) : exams.length === 0 ? (
            <p>No oral exams created yet.</p>
          ) : (
            exams.map((exam) => (
              <Card
                key={exam._id}
                className="p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">{exam.topic}</h3>
                  <p className="text-sm text-muted-foreground">
                    Duration: {exam.duration} mins
                  </p>
                </div>

                <Button
                  onClick={() =>
                    router.push(`/faculty/review/oral/${exam._id}`)
                  }
                >
                  View Statistics
                </Button>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Quiz Placeholder */}
      {activeTab === 'quiz' && (
        <Card className="p-6 text-center">
          Quiz exam analytics coming soon 🚀
        </Card>
      )}
    </div>
  )
}
