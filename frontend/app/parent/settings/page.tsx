'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Lock, Bell, Eye, Trash2 } from 'lucide-react'

export default function ParentSettingsPage() {
  const children = [
    { id: 1, name: 'Emma Johnson', linked: true },
    { id: 2, name: 'Liam Johnson', linked: true },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-foreground">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">Full Name</label>
            <input
              type="text"
              placeholder="John Johnson"
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:border-primary"
            />
          </div>
          <Button className="w-full">Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-foreground">Linked Children</h2>
        <div className="space-y-3">
          {children.map((child) => (
            <div key={child.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium text-foreground">{child.name}</p>
                <Badge variant="default" className="mt-2">Linked</Badge>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-foreground">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Real-time notifications</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Progress Updates</p>
                <p className="text-sm text-muted-foreground">Weekly progress reports</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-foreground">Security</h2>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <Lock className="h-4 w-4" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <Lock className="h-4 w-4" />
            Two-Factor Authentication
          </Button>
        </div>
      </Card>

      <Card className="border-red-200 bg-red-50 p-6">
        <h2 className="mb-4 font-semibold text-red-700">Danger Zone</h2>
        <p className="mb-4 text-sm text-red-600">These actions are irreversible. Please proceed with caution.</p>
        <Button variant="destructive" className="w-full justify-start gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </Card>
    </div>
  )
}
