'use client'

import { useEffect, useMemo, useState } from 'react'
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
  BarChart,
  Bar,
} from 'recharts'
import { TrendingUp, BookOpen, Target, AlertCircle } from 'lucide-react'

const COLORS = [
  '#7C3AED',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#22C55E',
]

export default function ParentDashboard() {
  const router = useRouter()

  const [children, setChildren] = useState<any[]>([])
  const [childrenProgress, setChildrenProgress] = useState<Record<string, any>>({})
  const [selectedChild, setSelectedChild] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          'http://localhost:5000/api/parent/dashboard',
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const childrenData = await res.json()
        setChildren(childrenData)

        const progressResults = await Promise.all(
          childrenData.map(async (child: any) => {
            try {
              const r = await fetch(
                `http://localhost:5000/api/parent/child-progress/${child._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              )
              const p = await r.json()
              return { childId: child._id, progress: p }
            } catch {
              return { childId: child._id, progress: null }
            }
          })
        )

        const map: Record<string, any> = {}
        progressResults.forEach((r) => {
          map[r.childId] = r.progress
        })

        setChildrenProgress(map)
      } catch (err) {
        console.error('Dashboard fetch error', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [token, router])

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    let totalQuizzes = 0
    let totalScore = 0
    let attentionNeeded = 0

    children.forEach((child) => {
      const p = childrenProgress[child._id]?.child
      if (!p) return

      totalQuizzes += p.totalExams || 0
      totalScore += p.averageScore || 0

      if (p.averageScore < 60) attentionNeeded++
    })

    const avgScore =
      children.length > 0 ? Math.round(totalScore / children.length) : 0

    return {
      totalQuizzes,
      avgScore,
      attentionNeeded,
    }
  }, [children, childrenProgress])

  /* ================= LINE CHART ================= */
const progressData = useMemo(() => {
  /**
   * Structure:
   * {
   *   Jan: { month: 'Jan', Rahul: 70, Anaya: 82 },
   *   Feb: { month: 'Feb', Rahul: 75, Anaya: 85 }
   * }
   */
  const monthlyMap: Record<
    string,
    { month: string; [childName: string]: number }
  > = {}

  children.forEach((child) => {
    const progress = childrenProgress[child._id]
    if (!progress?.recentAttempts) return

    // group attempts by month for THIS child
    const byMonth: Record<string, number[]> = {}

    progress.recentAttempts.forEach((a: any) => {
      const month = new Date(a.submittedAt).toLocaleDateString('en', {
        month: 'short',
      })

      if (!byMonth[month]) byMonth[month] = []
      byMonth[month].push(a.score || 0)
    })

    // calculate monthly average
    Object.entries(byMonth).forEach(([month, scores]) => {
      const avg =
        scores.reduce((sum, s) => sum + s, 0) / scores.length

      if (!monthlyMap[month]) {
        monthlyMap[month] = { month }
      }

      monthlyMap[month][child.fullName] = Math.round(avg)
    })
  })

  // sort months in calendar order
  const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  return Object.values(monthlyMap).sort(
    (a, b) =>
      monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  )
}, [children, childrenProgress])

  /* ================= BAR CHART ================= */
  const activityData = useMemo(() => {
    return children.map((child) => ({
      name: child.fullName,
      quizzes: childrenProgress[child._id]?.child?.totalExams || 0,
    }))
  }, [children, childrenProgress])

  /* ================= HANDLERS ================= */
  const openDetails = (child: any) => {
    setSelectedChild(child)
    setShowDetailsModal(true)
  }

  const goToProgress = (childId: string) => {
    router.push(`/parent/progress?child=${childId}`)
    setShowDetailsModal(false)
  }

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard…</div>
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Parent Dashboard</h1>

      {/* ===== STATS ===== */}
      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={<TrendingUp />} label="Average Score" value={`${stats.avgScore}%`} />
        <Stat icon={<BookOpen />} label="Total Quizzes" value={stats.totalQuizzes} />
        <Stat icon={<Target />} label="Children" value={children.length} />
        <Stat icon={<AlertCircle />} label="Attention Needed" value={stats.attentionNeeded} />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <h2 className="mb-4 font-semibold">Progress Over Time</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              {children.map((child, i) => (
                <Line
                  key={child._id}
                  dataKey={child.fullName}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-semibold">Child Activity</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={activityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quizzes" fill="#7C3AED" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ===== CHILD LIST ===== */}
      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Your Children</h2>
        {children.map((child) => (
          <div
            key={child._id}
            className="flex justify-between items-center border rounded p-4 mb-3"
          >
            <div>
              <p className="font-medium">{child.fullName}</p>
              <p className="text-sm text-muted-foreground">{child.studentId}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => openDetails(child)}>
              View Details
            </Button>
          </div>
        ))}
      </Card>

      {/* ===== MODAL ===== */}
      {showDetailsModal && selectedChild && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedChild.fullName}
            </h2>

            <p>
              Average Score:{' '}
              <strong>
                {childrenProgress[selectedChild._id]?.child?.averageScore || 0}%
              </strong>
            </p>

            <div className="flex gap-3 mt-6">
              <Button
                className="flex-1"
                onClick={() => goToProgress(selectedChild._id)}
              >
                View Full Progress
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

/* ===== SMALL STAT CARD ===== */
function Stat({ icon, label, value }: any) {
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