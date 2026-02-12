'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Info, Calendar } from 'lucide-react'

export default function ParentNotificationsPage() {

  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )

        const data = await res.json()

        const formatted = data.map((n: any) => ({
          id: n._id,
          type: n.type || "info",
          title: n.title,
          message: n.message,
          child: n.childName || "Your Child",
          time: new Date(n.createdAt).toLocaleString(),
          read: n.read,
        }))

        setNotifications(formatted)

      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      )

    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }


  return (
    <div className="space-y-8 p-8">
  <div className="animate-fade-in">
    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text">
      Notifications
    </h1>
    <p className="text-muted-foreground mt-2 text-sm font-medium tracking-wide">
      Stay updated on your children's academic progress and activities
    </p>
  </div>

  <div className="space-y-4">
    {notifications.map((notification, index) => (
      <Card
        key={notification.id}
        className={`p-6 transition-all duration-500 hover:translate-x-1 hover:shadow-lg ${
          !notification.read 
            ? 'border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent shadow-sm' 
            : 'opacity-90 hover:opacity-100'
        }`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex items-start gap-6">
          <div className={`p-3 rounded-xl transition-transform duration-300 hover:scale-110 ${
            !notification.read ? 'bg-primary/10' : 'bg-secondary'
          }`}>
            {getIcon(notification.type)}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-foreground tracking-tight">
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <div className="relative">
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
                <p className="text-foreground/80 text-base leading-relaxed tracking-wide">
                  {notification.message}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2 ml-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className="tracking-wide">{notification.time}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className="px-4 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  <span className="text-sm tracking-wide">{notification.child}</span>
                </Badge>
                
                <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                  {notification.type}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  !notification.read 
                    ? 'bg-primary/10 text-primary animate-pulse' 
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  {!notification.read ? 'NEW' : 'READ'}
                </span>
                
                {!notification.read ? (
                  <button 
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    Mark as read
                  </button>
                ) : (
                  <div className="text-xs font-medium text-green-600 flex items-center gap-2">
                    <span className="text-green-500 text-lg">✓</span>
                    Read
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>

  {notifications.length === 0 && (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
        <span className="text-3xl text-muted-foreground">🔔</span>
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
        No notifications yet
      </h3>
      <p className="text-muted-foreground max-w-md text-center">
        You're all caught up! Notifications about your children's progress will appear here.
      </p>
    </div>
  )}
</div>
  )
}
