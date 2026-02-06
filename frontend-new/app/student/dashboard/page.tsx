'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { TrendingUp, Target, Clock, Award, Flame } from 'lucide-react'

const performanceTrendData = [
  { name: 'Week 1', accuracy: 65 },
  { name: 'Week 2', accuracy: 72 },
  { name: 'Week 3', accuracy: 78 },
  { name: 'Week 4', accuracy: 85 },
  { name: 'Week 5', accuracy: 88 },
]

const subjectPerformanceData = [
  { name: 'Math', value: 92 },
  { name: 'Science', value: 85 },
  { name: 'English', value: 78 },
  { name: 'History', value: 88 },
]

const COLORS = ['#7C3AED', '#06B6D4', '#10B981', '#F59E0B']

const kpiData = [
  {
    label: 'Overall Accuracy',
    value: '88%',
    icon: Target,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Tests Completed',
    value: '24',
    icon: Award,
    color: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    label: 'Study Hours',
    value: '145',
    icon: Clock,
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    label: 'Certificates',
    value: '5',
    icon: Award,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    label: 'Day Streak',
    value: '12',
    icon: Flame,
    color: 'bg-red-100',
    iconColor: 'text-red-600',
  },
]

const recentActivity = [
  { type: 'Quiz Completed', subject: 'Mathematics', score: '92%', time: '2 hours ago' },
  { type: 'Material Uploaded', subject: 'Physics', description: 'Chapter 5 Notes', time: '1 day ago' },
  { type: 'Certificate Earned', subject: 'Advanced Python', time: '3 days ago' },
  { type: 'Oral Practice', subject: 'English', duration: '30 min', time: '4 days ago' },
]

export default function StudentDashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
        <p className="text-muted-foreground mt-2">Track your learning progress and continue your journey</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend */}
        <Card className="lg:col-span-2 p-6 border border-border">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Performance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subject Performance */}
        <Card className="p-6 border border-border">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Subject Performance</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={subjectPerformanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {subjectPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Subject Performance Bar Chart */}
      <Card className="p-6 border border-border">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Subject-wise Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#7C3AED" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 border border-border">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.subject}
                    {activity.score && ` - ${activity.score}`}
                    {activity.description && ` - ${activity.description}`}
                    {activity.duration && ` - ${activity.duration}`}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
