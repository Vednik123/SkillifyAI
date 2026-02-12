'use client'

import { Card } from '@/components/ui/card'
import { Zap, BookOpen, Users, BarChart3, Shield, Lightbulb } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'AI Proctoring',
      description: 'Advanced AI-powered exam monitoring to ensure exam integrity and prevent cheating',
    },
    {
      icon: Lightbulb,
      title: 'Smart Recommendations',
      description: 'Personalized learning paths based on your performance and learning style',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Comprehensive performance metrics and insights to track your progress',
    },
    {
      icon: BookOpen,
      title: 'Rich Learning Materials',
      description: 'Access to curated study materials, notes, and resources from expert faculty',
    },
    {
      icon: Users,
      title: 'Interactive Community',
      description: 'Connect with peers, ask questions, and learn together in a supportive environment',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get immediate feedback on your quizzes and exams with detailed explanations',
    },
  ]

  return (
    <section id="features" className="py-20 md:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Powerful Features Built for Success</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to excel in your examinations and accelerate your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 group hover:scale-105"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
