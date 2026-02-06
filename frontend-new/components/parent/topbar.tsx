'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Search, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function ParentTopbar() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const notifications = [
    { id: 1, message: 'Emma completed a quiz with 92% score', time: '2 hours ago' },
    { id: 2, message: 'Liam has a new certification earned', time: '5 hours ago' },
    { id: 3, message: 'New material uploaded by faculty', time: '1 day ago' },
  ]

  return (
    <div className="relative flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex w-64 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <Button 
            onClick={() => setShowNotifications(!showNotifications)}
            variant="ghost" 
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
          </Button>
          
          {showNotifications && (
            <Card className="absolute right-0 top-12 w-80 p-0 border border-border shadow-lg z-50">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                    <p className="text-sm text-foreground">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <Link href="/parent/notifications" className="block">
                <Button 
                  onClick={() => setShowNotifications(false)}
                  variant="ghost" 
                  className="w-full justify-center rounded-none border-t border-border"
                >
                  View All
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <Button 
            onClick={() => setShowProfile(!showProfile)}
            variant="ghost" 
            size="icon"
          >
            <User className="h-5 w-5" />
          </Button>
          
          {showProfile && (
            <Card className="absolute right-0 top-12 w-56 p-0 border border-border shadow-lg z-50">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-foreground">Profile</h3>
                <button onClick={() => setShowProfile(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">John Parent</p>
                <p className="text-xs text-muted-foreground">parent@example.com</p>
              </div>
              <div className="border-t border-border p-2 space-y-1">
                <Link href="/parent/profile" className="block">
                  <Button 
                    onClick={() => setShowProfile(false)}
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    My Profile
                  </Button>
                </Link>
                <Link href="/parent/settings" className="block">
                  <Button 
                    onClick={() => setShowProfile(false)}
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    Settings
                  </Button>
                </Link>
                <Button 
                  onClick={() => {
                    alert('Logged out successfully')
                    setShowProfile(false)
                  }}
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
