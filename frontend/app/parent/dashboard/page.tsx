'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, BookOpen, Target, AlertCircle } from 'lucide-react'

export default function ParentDashboard() {
  const router = useRouter()
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedChild, setSelectedChild] = useState<any>(null)
  const handleViewDetails = (child: any) => {
    setSelectedChild(child)
    setShowDetailsModal(true)
  }

  const handleGoToProgress = (childName: string) => {
    router.push(`/parent/progress?child=${encodeURIComponent(childName)}`)
    setShowDetailsModal(false)
  }

  const children = [
    { id: 1, name: 'Emma Johnson', grade: '10th Grade', avgScore: 85 },
    { id: 2, name: 'Liam Johnson', grade: '8th Grade', avgScore: 78 },
  ]

  const progressData = [
    { month: 'Jan', Emma: 75, Liam: 68 },
    { month: 'Feb', Emma: 78, Liam: 72 },
    { month: 'Mar', Emma: 82, Liam: 75 },
    { month: 'Apr', Emma: 85, Liam: 78 },
  ]

  const activityData = [
    { name: 'Quizzes', value: 45 },
    { name: 'Materials', value: 32 },
    { name: 'Certifications', value: 8 },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Parent Dashboard</h1>
        <p className="text-muted-foreground">Monitor your children's learning progress</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold">82.5%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quizzes Taken</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-100 p-3">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Certifications</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-orange-100 p-3">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Attention Needed</p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <h2 className="mb-4 font-semibold text-foreground">Progress Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Emma" stroke="#7C3AED" strokeWidth={2} />
              <Line type="monotone" dataKey="Liam" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-semibold text-foreground">Learning Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#7C3AED" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-foreground">Your Children</h2>
        <div className="space-y-3">
          {children.map((child) => (
            <div key={child.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium text-foreground">{child.name}</p>
                <p className="text-sm text-muted-foreground">{child.grade}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{child.avgScore}%</p>
                  <p className="text-xs text-muted-foreground">Average Score</p>
                </div>
                <Button 
                  onClick={() => handleViewDetails(child)}
                  variant="outline" 
                  size="sm"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedChild && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-8 border border-border">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">{selectedChild.name}</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-2xl text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Grade</p>
                  <p className="font-semibold text-foreground">{selectedChild.grade}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Average Score</p>
                  <p className="font-semibold text-foreground">{selectedChild.avgScore}%</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Recent Activity: Active in 5 quizzes this week</p>
                <p>Progress: Improving in Mathematics</p>
                <p>Status: On Track</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => handleGoToProgress(selectedChild.name)}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  View Full Progress
                </Button>
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
