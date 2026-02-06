'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GraduationCap, ArrowRight } from 'lucide-react'

export default function AITutorPage() {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('30')
  const [isStarting, setIsStarting] = useState(false)

  const commonSubjects = [
    'Calculus',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Literature',
    'Programming',
    'Database Design',
    'Operating Systems',
    'Networks',
    'Artificial Intelligence',
    'Machine Learning',
  ]

  const handleStartSession = () => {
    if (subject && duration) {
      setIsStarting(true)
      setTimeout(() => {
        router.push(`/student/ai-tutor/session?subject=${encodeURIComponent(subject)}&duration=${duration}`)
      }, 800)
    }
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AI Tutor</h1>
        </div>
        <p className="text-muted-foreground">
          Learn any topic with your personal AI classroom teacher. Step-by-step explanations with interactive whiteboard.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Setup Panel */}
        <Card className="p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Start a Learning Session</h2>
          
          <div className="space-y-6">
            {/* Subject Selection */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                Choose a Topic <span className="text-red-500">*</span>
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="h-10 border-border bg-background">
                  <SelectValue placeholder="Select a subject or topic..." />
                </SelectTrigger>
                <SelectContent>
                  {commonSubjects.map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Or type a custom topic like "Deadlock in Operating Systems"
              </p>
            </div>

            {/* Custom Subject Input */}
            <div className="space-y-2">
              <Label htmlFor="customSubject" className="text-sm font-medium text-foreground">
                Custom Topic
              </Label>
              <Input
                id="customSubject"
                placeholder="Enter a specific topic..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-10 border-border bg-background"
              />
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-foreground">
                Session Duration <span className="text-red-500">*</span>
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-10 border-border bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes (1 hour)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose between 10 minutes to 1 hour
              </p>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartSession}
              disabled={!subject || !duration || isStarting}
              className="w-full bg-primary hover:bg-primary/90 h-11 gap-2 text-base font-medium"
            >
              {isStarting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Start Learning Session
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Features Panel */}
        <Card className="p-8 border border-border bg-secondary/50">
          <h3 className="text-xl font-bold text-foreground mb-6">What You'll Get</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">AI Avatar Teacher</h4>
                  <p className="text-sm text-muted-foreground">
                    Interactive avatar that explains concepts with speaking animations
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Digital Whiteboard</h4>
                  <p className="text-sm text-muted-foreground">
                    Step-by-step explanations written and shown on a virtual whiteboard
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Repeat Anytime</h4>
                  <p className="text-sm text-muted-foreground">
                    Replay explanations as many times as you need to master the topic
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">No Pressure</h4>
                  <p className="text-sm text-muted-foreground">
                    Learning without grading or performance evaluation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Example Topics */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-3">Example Topics:</p>
            <div className="flex flex-wrap gap-2">
              {['Photosynthesis', 'Calculus Limits', 'Database Indexing', 'DNA Replication'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSubject(topic)}
                  className="px-3 py-1 rounded-full border border-border hover:bg-background/50 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
