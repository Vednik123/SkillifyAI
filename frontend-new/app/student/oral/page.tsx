'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { Mic2, Play, Clock } from 'lucide-react'

export default function OralPracticePage() {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [timeLimit, setTimeLimit] = useState('10')
  const [isStarting, setIsStarting] = useState(false)

  const handleStartSession = () => {
    if (subject && timeLimit) {
      setIsStarting(true)
      // Redirect to oral session page with query params
      router.push(`/student/oral/session?subject=${encodeURIComponent(subject)}&duration=${timeLimit}`)
    }
  }

  return (
    <div className="p-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Oral Practice</h1>
        <p className="text-muted-foreground mt-2">Practice speaking with AI and improve your communication skills</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="p-8 border border-border space-y-6">
            <form className="space-y-6">
              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject/Topic <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="e.g., English, Spanish, Presentation Skills..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="h-10 border-border bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the language or topic you want to practice
                </p>
              </div>

              {/* Time Limit */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium text-foreground">
                  Session Duration <span className="text-red-500">*</span>
                </Label>
                <Select value={timeLimit} onValueChange={setTimeLimit}>
                  <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Difficulty Level
                </Label>
                <Select defaultValue="intermediate">
                  <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Button */}
              <Button
                type="button"
                onClick={handleStartSession}
                disabled={!subject || isStarting}
                className="w-full bg-primary hover:bg-primary/90 h-11 gap-2 font-semibold"
              >
                <Mic2 className="w-4 h-4" />
                {isStarting ? 'Starting...' : 'Start Oral Session'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <Card className="p-6 border border-border space-y-4">
            <h3 className="font-semibold text-foreground">How It Works</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">1.</span>
                <span>AI Avatar introduces the topic</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">2.</span>
                <span>Listen to questions and respond</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">3.</span>
                <span>Get real-time feedback</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">4.</span>
                <span>Review analytics and improve</span>
              </li>
            </ol>
          </Card>

          <Card className="p-6 border border-blue-200 bg-blue-50 space-y-3">
            <h3 className="font-semibold text-blue-900">Requirements</h3>
            <ul className="space-y-2 text-xs text-blue-800">
              <li>✓ Microphone enabled</li>
              <li>✓ Quiet environment</li>
              <li>✓ Good internet connection</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Previous Sessions */}
      <section className="space-y-6 border-t border-border pt-8">
        <h2 className="text-2xl font-semibold text-foreground">Previous Sessions</h2>
        <Card className="p-12 border border-border text-center">
          <Mic2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No sessions yet. Start your first oral practice!</p>
        </Card>
      </section>
    </div>
  )
}
