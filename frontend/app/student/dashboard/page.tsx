'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Target, Award, Clock, Flame, TrendingUp } from 'lucide-react'

export default function StudentDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [dashboardData, setDashboardData] = useState({
    totalExams: 0,
    avgScore: 0,
    passRate: 0,
    recentExams: [] as any[],
    subjectPerformance: [] as any[],
    studyHours: 0,
    certificates: 0,
    streak: 0,
  })

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const COLORS = ['#7C3AED', '#06B6D4', '#10B981', '#F59E0B']

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/student/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        setDashboardData({
          totalExams: data.totalExams || 0,
          avgScore: data.avgScore || 0,
          passRate: data.passRate || 0,
          recentExams: data.recentExams || [],
          subjectPerformance: data.subjectPerformance || [],
          studyHours: data.studyHours || 0,
          certificates: data.certificates || 0,
          streak: data.streak || 0,
        })
      } catch (err) {
        console.error('Student dashboard fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token, router])

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your learning progress and growth
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-6 flex items-center gap-4">
          <Target className="text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Avg Score</p>
            <p className="text-2xl font-bold">{dashboardData.avgScore}%</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <Award className="text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Tests Completed</p>
            <p className="text-2xl font-bold">{dashboardData.totalExams}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <Clock className="text-yellow-600" />
          <div>
            <p className="text-sm text-muted-foreground">Study Hours</p>
            <p className="text-2xl font-bold">{dashboardData.studyHours}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <TrendingUp className="text-purple-600" />
          <div>
            <p className="text-sm text-muted-foreground">Pass Rate</p>
            <p className="text-2xl font-bold">{dashboardData.passRate}%</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <Flame className="text-red-600" />
          <div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
            <p className="text-2xl font-bold">{dashboardData.streak}</p>
          </div>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PERFORMANCE TREND */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="font-semibold mb-4">Performance Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dashboardData.recentExams.map((exam, index) => ({
                attempt: index + 1,
                score: exam.score || 0,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attempt" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#7C3AED"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* SUBJECT PERFORMANCE */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Subject Performance</h2>

          {dashboardData.subjectPerformance.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              No subject data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={dashboardData.subjectPerformance}
                  dataKey="score"
                  nameKey="subject"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={3}
                  label
                >
                  {dashboardData.subjectPerformance.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* RECENT ACTIVITY */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>

        {dashboardData.recentExams.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            No exams attempted yet
          </p>
        ) : (
          <div className="space-y-4">
            {dashboardData.recentExams.slice(0, 5).map((exam, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-medium">{exam.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {exam.title} • Score {exam.score}%
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded text-sm ${
                    exam.score >= 40
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {exam.score >= 40 ? 'Passed' : 'Failed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button onClick={() => router.push('/student/quiz/scheduled')}>
          View Exams
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/student/materials')}
        >
          Browse Materials
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/student/ai-tutor')}
        >
          AI Tutor
        </Button>
      </div>
    </div>
  )
}