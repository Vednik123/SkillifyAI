'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Clock, Plus, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const scheduledSessions = [
  {
    id: 1,
    student: 'John Doe',
    date: 'March 20, 2024',
    time: '10:00 AM',
    topic: 'English Speaking',
    duration: '30 min',
  },
  {
    id: 2,
    student: 'Jane Smith',
    date: 'March 20, 2024',
    time: '11:00 AM',
    topic: 'English Speaking',
    duration: '30 min',
  },
  {
    id: 3,
    student: 'Bob Johnson',
    date: 'March 21, 2024',
    time: '2:00 PM',
    topic: 'Spanish Conversation',
    duration: '45 min',
  },
]

export default function OralSchedulePage() {
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [formData, setFormData] = useState({
    studentName: '',
    date: '',
    time: '',
    topic: '',
    duration: '30'
  })

  const handleScheduleClick = () => {
    setShowScheduleModal(true)
  }

  const handleScheduleSubmit = () => {
    if (formData.studentName && formData.date && formData.time && formData.topic) {
      alert(`Oral exam scheduled successfully!\nStudent: ${formData.studentName}\nDate: ${formData.date}\nTime: ${formData.time}`)
      setShowScheduleModal(false)
      setFormData({ studentName: '', date: '', time: '', topic: '', duration: '30' })
    }
  }

  const handleModalClose = () => {
    setShowScheduleModal(false)
    setFormData({ studentName: '', date: '', time: '', topic: '', duration: '30' })
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Oral Exam Schedule</h1>
          <p className="text-muted-foreground mt-2">Schedule oral practice sessions with students</p>
        </div>
        <Button 
          onClick={handleScheduleClick}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Schedule Session
        </Button>
      </div>

      {/* Scheduled Sessions Table */}
      <Card className="p-6 border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 font-semibold text-foreground">Student</th>
              <th className="text-left py-3 font-semibold text-foreground">Date</th>
              <th className="text-left py-3 font-semibold text-foreground">Time</th>
              <th className="text-left py-3 font-semibold text-foreground">Topic</th>
              <th className="text-left py-3 font-semibold text-foreground">Duration</th>
              <th className="text-left py-3 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scheduledSessions.map((session) => (
              <tr key={session.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="py-3 text-foreground">{session.student}</td>
                <td className="py-3 text-muted-foreground">{session.date}</td>
                <td className="py-3 text-muted-foreground">{session.time}</td>
                <td className="py-3 text-muted-foreground">{session.topic}</td>
                <td className="py-3 text-muted-foreground">{session.duration}</td>
                <td className="py-3 space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-8 border border-border">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Schedule Oral Session</h2>
                <button 
                  onClick={handleModalClose}
                  className="text-2xl text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Student Name */}
                <div className="space-y-2">
                  <Label htmlFor="studentName" className="text-sm font-medium text-foreground">
                    Student Name
                  </Label>
                  <Input
                    id="studentName"
                    placeholder="Enter student name"
                    value={formData.studentName}
                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    className="h-10 border-border bg-background"
                  />
                </div>

                {/* Date Picker */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-foreground">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="h-10 border-border bg-background"
                  />
                </div>

                {/* Time Selector */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium text-foreground">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="h-10 border-border bg-background"
                  />
                </div>

                {/* Topic Selection */}
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm font-medium text-foreground">
                    Examination Topic
                  </Label>
                  <Select value={formData.topic} onValueChange={(value) => setFormData({...formData, topic: value})}>
                    <SelectTrigger className="h-10 border-border bg-background">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English Speaking">English Speaking</SelectItem>
                      <SelectItem value="Spanish Conversation">Spanish Conversation</SelectItem>
                      <SelectItem value="French Speaking">French Speaking</SelectItem>
                      <SelectItem value="Interview Skills">Interview Skills</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium text-foreground">
                    Duration (minutes)
                  </Label>
                  <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                    <SelectTrigger className="h-10 border-border bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleScheduleSubmit}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Schedule Exam
                </Button>
                <Button 
                  onClick={handleModalClose}
                  variant="outline" 
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
