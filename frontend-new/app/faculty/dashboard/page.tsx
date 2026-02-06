'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Users, FileText, Clock, TrendingUp } from 'lucide-react'

const scheduleData = [
  {
    id: 1,
    title: 'Mathematics - Calculus',
    date: 'March 20, 2024',
    time: '10:00 AM',
    students: 32,
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Physics - Quantum Mechanics',
    date: 'March 22, 2024',
    time: '2:00 PM',
    students: 28,
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Chemistry - Organic Chemistry',
    date: 'March 18, 2024',
    time: '11:00 AM',
    students: 30,
    status: 'completed',
  },
]

const performanceData = [
  { subject: 'Math', avg: 82 },
  { subject: 'Physics', avg: 78 },
  { subject: 'Chemistry', avg: 85 },
  { subject: 'English', avg: 80 },
]

const kpiData = [
  {
    label: 'Total Students',
    value: '156',
    icon: Users,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Exams Created',
    value: '24',
    icon: FileText,
    color: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    label: 'Pending Reviews',
    value: '8',
    icon: Clock,
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    label: 'Avg Pass Rate',
    value: '82%',
    icon: TrendingUp,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
]

export default function FacultyDashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Prof. Smith!</h1>
        <p className="text-muted-foreground mt-2">Manage your exams, students, and track their progress</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} className="p-6 border border-border hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-lg ${kpi.color} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule Overview */}
        <Card className="p-6 border border-border">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Upcoming Exams</h2>
            <div className="space-y-3">
              {scheduleData.filter((s) => s.status === 'upcoming').map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                  <div>
                    <p className="font-medium text-foreground text-sm">{schedule.title}</p>
                    <p className="text-xs text-muted-foreground">{schedule.date} at {schedule.time}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                    {schedule.students} students
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Performance Overview */}
        <Card className="p-6 border border-border">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Average Performance by Subject</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avg" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 border border-border">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Recent Exam Activity</h2>
          <div className="space-y-4">
            {scheduleData.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.date} • {activity.students} students
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  activity.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {activity.status === 'completed' ? 'Completed' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button className="h-12 bg-primary hover:bg-primary/90 text-base">
          Create New Exam
        </Button>
        <Button variant="outline" className="h-12 text-base bg-transparent">
          Upload Materials
        </Button>
        <Button variant="outline" className="h-12 text-base bg-transparent">
          View All Students
        </Button>
      </div>
    </div>
  )
}
