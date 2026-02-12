'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PlayCircle, Brain, TrendingUp, Zap } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Transform Your Learning Journey with AI
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Experience next-generation examinations with AI-powered proctoring, personalized quizzes, intelligent recommendations, and real-time analytics.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">AI Proctored Exams</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">Smart Recommendations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">Real-time Analytics</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/role-select">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 bg-transparent">
                <PlayCircle className="w-4 h-4" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Side - Illustration with Stats */}
          <div className="relative animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
            <div className="relative">
              {/* Background gradient card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-2xl blur-2xl" />

              {/* Main card with stats */}
              <Card className="relative p-8 md:p-12 border-0 shadow-lg bg-white">
                <div className="space-y-8">
                  {/* Floating stat badges */}
                  <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top duration-500 delay-300">
                    <div className="bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
                      <p className="text-sm font-semibold text-primary">50,000+</p>
                      <p className="text-xs text-muted-foreground">Active Students</p>
                    </div>
                  </div>

                  <div className="absolute bottom-32 left-4 animate-in fade-in slide-in-from-left duration-500 delay-500">
                    <div className="bg-green-100 border border-green-200 rounded-full px-4 py-2">
                      <p className="text-sm font-semibold text-green-700">95%</p>
                      <p className="text-xs text-green-600">Success Rate</p>
                    </div>
                  </div>

                  <div className="absolute bottom-12 right-8 animate-in fade-in slide-in-from-right duration-500 delay-700">
                    <div className="bg-blue-100 border border-blue-200 rounded-full px-4 py-2">
                      <p className="text-sm font-semibold text-blue-700">500+</p>
                      <p className="text-xs text-blue-600">Courses Available</p>
                    </div>
                  </div>

                  {/* Hero Image */}
                  <img 
                    src="/hero-section-image.png" 
                    alt="Students studying with SkillifyAI"
                    className="h-64 md:h-80 rounded-xl w-full object-cover border border-primary/10"
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
