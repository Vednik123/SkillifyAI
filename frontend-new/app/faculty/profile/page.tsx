'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const facultyData = {
  facultyId: 'FAC-2024-001234',
  name: 'Prof. Smith',
  email: 'prof.smith@university.edu',
  phone: '+1 (555) 123-4567',
  department: 'Mathematics',
  joinDate: 'January 10, 2023',
  students: 156,
  examsCreated: 24,
  totalReviews: 47,
}

export default function FacultyProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(facultyData)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setFormData(facultyData)
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
        <p className="text-muted-foreground mt-2">Manage your faculty profile and information</p>
      </div>

      {/* Profile Information */}
      <Card className="p-8 border border-border space-y-8">
        {/* Profile Picture and ID */}
        <div className="flex items-start gap-8">
          <Avatar className="w-24 h-24 border-4 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
              PS
            </AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Faculty ID</p>
              <p className="text-2xl font-bold text-foreground">{facultyData.facultyId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium text-foreground">{facultyData.joinDate}</p>
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
                value={facultyData.phone}
                disabled
                className="h-10 border-border bg-secondary"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-foreground">
                Department
              </Label>
              <Input
                id="department"
                type="text"
                value={facultyData.department}
                disabled
                className="h-10 border-border bg-secondary"
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
            <p className="text-sm text-muted-foreground">Total Students</p>
            <p className="text-3xl font-bold text-foreground">{facultyData.students}</p>
          </div>
        </Card>
        <Card className="p-6 border border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Exams Created</p>
            <p className="text-3xl font-bold text-foreground">{facultyData.examsCreated}</p>
          </div>
        </Card>
        <Card className="p-6 border border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Reviews</p>
            <p className="text-3xl font-bold text-foreground">{facultyData.totalReviews}</p>
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
        </div>
      </Card>
    </div>
  )
}
