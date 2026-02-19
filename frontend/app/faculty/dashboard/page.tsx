'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Users, FileText, TrendingUp } from 'lucide-react'

export default function FacultyDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalExams: 0,
    avgPassRate: 0,
    recentExams: [] as any[],
    subjectPerformance: [] as any[],
  })

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          'http://localhost:5000/api/faculty/dashboard',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (!res.ok) throw new Error('Failed to fetch dashboard')

        const data = await res.json()

        setDashboardData({
          totalStudents: data.totalStudents || 0,
          totalExams: data.totalExams || 0,
          avgPassRate: data.avgPassRate || 0,
          recentExams: data.recentExams || [],
          subjectPerformance: data.subjectPerformance || [],
        })
      } catch (err) {
        console.error('Dashboard fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token, router])

  /* ================= KPI CARD ================= */
  function KpiCard({ icon, label, value }: any) {
    return (
      <Card className="p-6 flex items-center gap-4">
        <div className="p-3 bg-muted rounded">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </Card>
    )
  }

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
        <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your exams, students, and track their progress
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          icon={<Users />}
          label="Total Students"
          value={dashboardData.totalStudents}
        />
        <KpiCard
          icon={<FileText />}
          label="Exams Created"
          value={dashboardData.totalExams}
        />
        <KpiCard
          icon={<TrendingUp />}
          label="Avg Pass Rate"
          value={`${dashboardData.avgPassRate}%`}
        />
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT EXAMS */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Exams</h2>

          {dashboardData.recentExams.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No exams created yet
            </p>
          ) : (
            <div className="space-y-3">
              {dashboardData.recentExams.slice(0, 5).map((exam, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded bg-secondary/50"
                >
                  <div>
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.studentsCount} students
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      exam.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {exam.status === 'completed' ? 'Completed' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* PERFORMANCE METRICS */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>

          {dashboardData.subjectPerformance.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              No performance data available
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {/* PIE CHART */}
              <div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dashboardData.subjectPerformance}
                      dataKey="avgScore"
                      nameKey="subject"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={4}
                      label={({ subject, avgScore }) =>
                        `${subject} (${avgScore}%)`
                      }
                    >
                      {dashboardData.subjectPerformance.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* PERFORMANCE STATS */}
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Best Subject</p>
                      <p className="text-xl font-bold text-blue-800">
                        {dashboardData.subjectPerformance.reduce((best, current) => 
                          current.avgScore > best.avgScore ? current : best
                        ).subject}
                      </p>
                    </div>
                    <div className="text-3xl text-blue-500">🏆</div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Pass Rate</p>
                      <p className="text-xl font-bold text-green-800">
                        {Math.round(
                          dashboardData.subjectPerformance.filter(s => s.avgScore >= 40).length / 
                          dashboardData.subjectPerformance.length * 100
                        )}%
                      </p>
                    </div>
                    <div className="text-3xl text-green-500">✅</div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Avg Score</p>
                      <p className="text-xl font-bold text-purple-800">
                        {Math.round(
                          dashboardData.subjectPerformance.reduce((sum, s) => sum + s.avgScore, 0) / 
                          dashboardData.subjectPerformance.length
                        )}%
                      </p>
                    </div>
                    <div className="text-3xl text-purple-500">📊</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button
          onClick={() => router.push('/faculty/create-exam')}
          className="h-12"
        >
          Create New Exam
        </Button>

        <Button
          onClick={() => router.push('/faculty/material-upload')}
          variant="outline"
          className="h-12"
        >
          Upload Materials
        </Button>

        <Button
          onClick={() => router.push('/faculty/view-students')}
          variant="outline"
          className="h-12"
        >
          View All Students
        </Button>
      </div>
    </div>
  )
}