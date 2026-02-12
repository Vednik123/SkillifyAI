'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { BarChart3, BookOpen, Bell, User, LogOut, Home, Award, Users } from 'lucide-react'
import { UserPlus } from "lucide-react";
import { Button } from '@/components/ui/button'

export function ParentSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  const handleLogout = () => {
    alert('Logging out...')
    router.push('/')
  }

  const menuItems = [
    { label: "Add Child", href: "/parent/add-child", icon: UserPlus },
    { label: 'Dashboard', href: '/parent/dashboard', icon: Home },
    { label: 'Child Progress', href: '/parent/progress', icon: BarChart3 },
   { label: "Faculty of Child", href: "/parent/faculty", icon: Users },
    { label: 'Materials', href: '/parent/materials', icon: BookOpen },
    { label: 'Certifications', href: '/parent/certifications', icon: Award },
    { label: 'Notifications', href: '/parent/notifications', icon: Bell },
    { label: 'Profile', href: '/parent/profile', icon: User },
    
  ]

  return (
    <div className="w-64 border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/parent/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            AI
          </div>
          <span className="font-semibold text-foreground">SkillifyAI</span>
        </Link>
      </div>

      <nav className="space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={active ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="w-full justify-start gap-3 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}
