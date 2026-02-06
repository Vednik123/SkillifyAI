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
import { Briefcase, Play } from 'lucide-react'

export default function InterviewPracticePage() {
  const router = useRouter()
  const [interviewType, setInterviewType] = useState('')
  const [subject, setSubject] = useState('')
  const [timeLimit, setTimeLimit] = useState('30')
  const [isStarting, setIsStarting] = useState(false)

  const handleStartInterview = () => {
    if (interviewType && subject && timeLimit) {
      setIsStarting(true)
      // Redirect to interview session page with query params
      router.push(`/student/interview/session?type=${encodeURIComponent(interviewType)}&subject=${encodeURIComponent(subject)}&duration=${timeLimit}`)
    }
  }

  return (
    <div className="p-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Interview Practice</h1>
        <p className="text-muted-foreground mt-2">Prepare for real interviews with AI-powered mock interviews</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="p-8 border border-border space-y-6">
            <form className="space-y-6">
              {/* Interview Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Interview Type <span className="text-red-500">*</span>
                </Label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">HR Interview</SelectItem>
                    <SelectItem value="technical">Technical Interview</SelectItem>
                    <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                    <SelectItem value="case">Case Study Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject/Role */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Position/Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="e.g., Software Engineer, Data Scientist..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="h-10 border-border bg-background"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Interview Duration <span className="text-red-500">*</span>
                </Label>
                <Select value={timeLimit} onValueChange={setTimeLimit}>
                  <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Button */}
              <Button
                type="button"
                onClick={handleStartInterview}
                disabled={!interviewType || !subject || isStarting}
                className="w-full bg-primary hover:bg-primary/90 h-11 gap-2 font-semibold"
              >
                <Play className="w-4 h-4" />
                {isStarting ? 'Starting...' : 'Start Interview'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <Card className="p-6 border border-border space-y-4">
            <h3 className="font-semibold text-foreground">Interview Stages</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">1.</span>
                <span>Introduction</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">2.</span>
                <span>Technical/HR Questions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">3.</span>
                <span>Your Questions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">4.</span>
                <span>Feedback & Analytics</span>
              </li>
            </ol>
          </Card>

          <Card className="p-6 border border-green-200 bg-green-50 space-y-3">
            <h3 className="font-semibold text-green-900">Get Evaluated On</h3>
            <ul className="space-y-2 text-xs text-green-800">
              <li>✓ Communication Skills</li>
              <li>✓ Technical Knowledge</li>
              <li>✓ Problem Solving</li>
              <li>✓ Confidence Level</li>
              <li>✓ Time Management</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Interview Tips */}
      <Card className="p-8 border border-blue-200 bg-blue-50 space-y-4">
        <h3 className="text-lg font-semibold text-blue-900">Interview Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold text-blue-900 mb-2">Before Interview</p>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Test your camera and microphone</li>
              <li>• Ensure good lighting</li>
              <li>• Use a neutral background</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-blue-900 mb-2">During Interview</p>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Maintain eye contact</li>
              <li>• Speak clearly</li>
              <li>• Smile and be friendly</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Previous Interviews */}
      <section className="space-y-6 border-t border-border pt-8">
        <h2 className="text-2xl font-semibold text-foreground">Previous Interviews</h2>
        <Card className="p-12 border border-border text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No interviews yet. Start your first mock interview!</p>
        </Card>
      </section>
    </div>
  )
}
