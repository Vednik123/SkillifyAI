'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function ChildProgressPage() {
  const monthlyData = [
    { month: 'Week 1', score: 72 },
    { month: 'Week 2', score: 75 },
    { month: 'Week 3', score: 78 },
    { month: 'Week 4', score: 82 },
  ]

  const subjectData = [
    { subject: 'Math', score: 85, color: '#7C3AED' },
    { subject: 'English', score: 78, color: '#3B82F6' },
    { subject: 'Science', score: 88, color: '#10B981' },
    { subject: 'History', score: 82, color: '#F59E0B' },
  ]

  const strengths = [
    { category: 'Quizzes', percentage: 92 },
    { category: 'Assignments', percentage: 85 },
    { category: 'Projects', percentage: 78 },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Emma's Progress</h1>
        <p className="text-muted-foreground">Track detailed learning metrics and improvements</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">By Subject</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 font-semibold text-foreground">Score Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Current Average</p>
              <p className="mt-2 text-3xl font-bold text-foreground">82%</p>
              <p className="mt-2 text-xs text-green-600">↑ 5% from last month</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Quizzes Completed</p>
              <p className="mt-2 text-3xl font-bold text-foreground">24</p>
              <p className="mt-2 text-xs text-muted-foreground">This month</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Learning Streak</p>
              <p className="mt-2 text-3xl font-bold text-foreground">12 days</p>
              <p className="mt-2 text-xs text-blue-600">Keep it up!</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 font-semibold text-foreground">Performance by Subject</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#7C3AED" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid gap-4">
            {subjectData.map((subject) => (
              <Card key={subject.subject} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{subject.subject}</p>
                    <div className="mt-2 h-2 w-48 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${subject.score}%`,
                          backgroundColor: subject.color,
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{subject.score}%</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 font-semibold text-foreground">Activity Strengths</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={strengths}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  <Cell fill="#7C3AED" />
                  <Cell fill="#3B82F6" />
                  <Cell fill="#10B981" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid gap-4">
            {strengths.map((activity) => (
              <Card key={activity.category} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{activity.category}</p>
                  <p className="text-lg font-semibold text-primary">{activity.percentage}%</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
