'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Mail, Phone, BookOpen } from 'lucide-react'

const studentData = {
  studentId: 'STU-2024-001234',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  educationLevel: "Bachelor's Degree",
  joinDate: 'January 15, 2024',
  totalQuizzes: 24,
  averageScore: '88%',
  certificatesEarned: 5,
}

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(studentData)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setFormData(studentData)
    setIsEditing(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your profile information</p>
      </div>

      {/* Profile Information */}
      <Card className="p-8 border border-border space-y-8">
        {/* Profile Picture and ID */}
        <div className="flex items-start gap-8">
          <Avatar className="w-24 h-24 border-4 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Student ID</p>
              <p className="text-2xl font-bold text-foreground">{studentData.studentId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium text-foreground">{studentData.joinDate}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!isEditing}
                className="h-10 border-border bg-secondary disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
                className="h-10 border-border bg-secondary disabled:opacity-50"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
                className="h-10 border-border bg-secondary disabled:opacity-50"
              />
            </div>

            {/* Education Level */}
            <div className="space-y-2">
              <Label htmlFor="education" className="text-sm font-medium text-foreground">
                Education Level
              </Label>
              <Input
                id="education"
                type="text"
                value={formData.educationLevel}
                onChange={(e) => handleChange('educationLevel', e.target.value)}
                disabled={!isEditing}
                className="h-10 border-border bg-secondary disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save Changes
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleEditClick}
                className="bg-primary hover:bg-primary/90"
              >
                Edit Information
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Quizzes</p>
            <p className="text-3xl font-bold text-foreground">{studentData.totalQuizzes}</p>
          </div>
        </Card>
        <Card className="p-6 border border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className="text-3xl font-bold text-foreground">{studentData.averageScore}</p>
          </div>
        </Card>
        <Card className="p-6 border border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Certificates Earned</p>
            <p className="text-3xl font-bold text-foreground">{studentData.certificatesEarned}</p>
          </div>
        </Card>
      </div>

      {/* Account Settings */}
      <Card className="p-8 border border-border space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>

        <div className="space-y-4">
          <Button variant="outline" className="w-full bg-transparent">
            Change Password
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            Download My Data
          </Button>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  )
}
