'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, User, Sparkles } from 'lucide-react'

export default function RoleSelectPage() {
  const router = useRouter()

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Learn with AI-powered exams, quizzes, and personalized guidance',
      icon: BookOpen,
      href: '/register?role=student',
    },
    {
      id: 'faculty',
      title: 'Faculty',
      description: 'Create exams, manage courses, and review student progress',
      icon: Users,
      href: '/register?role=faculty',
    },
    {
      id: 'parent',
      title: 'Parent',
      description: 'Monitor your child\'s progress and academic performance',
      icon: User,
      href: '/register?role=parent',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center justify-center gap-2 font-bold text-2xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-foreground">SkillifyAI</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Join SkillifyAI</h1>
          <p className="text-lg text-muted-foreground">Select your role to get started</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <Link key={role.id} href={role.href}>
                <Card className="h-full p-8 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 group cursor-pointer hover:scale-105">
                  <div className="space-y-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{role.title}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 group-hover:shadow-lg">
                      Get Started
                    </Button>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Already have account */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
