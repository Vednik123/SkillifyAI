'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function ChildProgressPage() {
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState('')
  const [childProgress, setChildProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token') || ''
      : ''

  // Fetch children on mount
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await fetch(
          'http://localhost:5000/api/parent/dashboard',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const data = await res.json()

        const childrenArray = Array.isArray(data) ? data : []
        setChildren(childrenArray)

        if (childrenArray.length > 0) {
          setSelectedChild(childrenArray[0]._id)
        }
      } catch (error) {
        console.error('Failed to fetch children:', error)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchChildren()
  }, [token])

  // Fetch child progress when child is selected
  useEffect(() => {
    if (!selectedChild) return

    const fetchChildProgress = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/parent/child-progress/${selectedChild}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const data = await res.json()
        setChildProgress(data)
      } catch (error) {
        console.error('Failed to fetch child progress:', error)
      }
    }

    fetchChildProgress()
  }, [selectedChild, token])

  // Generate score trend data
  const generateScoreTrend = () => {
    const attempts = childProgress?.recentAttempts ?? []
    if (attempts.length === 0) return []

    const monthlyScores: Record<
      string,
      { total: number; count: number }
    > = {}

    attempts.forEach((attempt: any) => {
      const date = new Date(attempt.submittedAt)
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`

      if (!monthlyScores[monthKey]) {
        monthlyScores[monthKey] = { total: 0, count: 0 }
      }

      monthlyScores[monthKey].total += attempt.score || 0
      monthlyScores[monthKey].count += 1
    })

    return Object.entries(monthlyScores)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en', {
          month: 'short'
        }),
        score: Math.round(data.total / data.count)
      }))
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  const subjectPerformance = childProgress?.subjectPerformance ?? {}
  const recentAttempts = childProgress?.recentAttempts ?? []

  return (
    <div className="space-y-6 p-6">
      {/* Child Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Child
        </label>
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a child..." />
          </SelectTrigger>
          <SelectContent>
            {children.map((child) => (
              <SelectItem key={child._id} value={child._id}>
                {child.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {childProgress ? (
        <>
          {/* Header */}
          <h1 className="text-3xl font-bold">
            {children.find((c) => c._id === selectedChild)?.fullName}
            ’s Progress
          </h1>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">By Subject</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-6">
                  <p>Total Exams</p>
                  <p className="text-3xl">
                    {childProgress.child?.totalExams ?? 0}
                  </p>
                </Card>
                <Card className="p-6">
                  <p>Average Score</p>
                  <p className="text-3xl">
                    {childProgress.child?.averageScore ?? 0}%
                  </p>
                </Card>
                <Card className="p-6">
                  <p>Pass Rate</p>
                  <p className="text-3xl">
                    {childProgress.child?.passRate ?? 0}%
                  </p>
                </Card>
              </div>

              <Card className="p-6 mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateScoreTrend()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
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
            </TabsContent>

            {/* Subjects */}
            <TabsContent value="subjects">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(subjectPerformance).map(
                    ([subject, perf]: any) => ({
                      subject,
                      score: perf.averageScore
                    })
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#7C3AED" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            {/* Activities */}
            <TabsContent value="activities">
              {recentAttempts.map((attempt: any, index: number) => (
                <Card key={index} className="p-4 mb-3">
                  <p className="font-medium">
                    {attempt.exam?.title}
                  </p>
                  <p>{attempt.score ?? 0}%</p>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <p>Select a child to view progress</p>
      )}
    </div>
  )
}