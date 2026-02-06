'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Info, Calendar } from 'lucide-react'

export default function ParentNotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Low Score Alert',
      message: 'Emma scored 65% on the Mathematics Quiz. Review recommended.',
      child: 'Emma',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'success',
      title: 'Certification Earned',
      message: 'Emma has earned the "English Proficiency" certification!',
      child: 'Emma',
      time: '1 day ago',
      read: true,
    },
    {
      id: 3,
      type: 'info',
      title: 'New Materials Available',
      message: 'Prof. Smith uploaded new Physics Lab Manual materials.',
      child: 'Emma',
      time: '2 days ago',
      read: true,
    },
    {
      id: 4,
      type: 'alert',
      title: 'Attendance Warning',
      message: 'Liam missed the last scheduled quiz session.',
      child: 'Liam',
      time: '3 days ago',
      read: false,
    },
    {
      id: 5,
      type: 'success',
      title: 'Progress Milestone',
      message: 'Liam has completed 50 quizzes this month!',
      child: 'Liam',
      time: '1 week ago',
      read: true,
    },
  ]

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
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Stay updated on your children's progress</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`p-4 ${!notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{notification.title}</h3>
                    <p className="mt-1 text-sm text-foreground">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="ml-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge variant="secondary">{notification.child}</Badge>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {notification.time}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
