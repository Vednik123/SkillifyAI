'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Share2 } from 'lucide-react'

export default function InterviewResultsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/student/interview">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Interview Results</h1>
            <p className="text-muted-foreground">Technical Interview - Software Engineer</p>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="p-12 border border-primary bg-gradient-to-br from-primary/5 to-transparent text-center space-y-4">
          <p className="text-muted-foreground text-lg">Your Overall Score</p>
          <p className="text-6xl font-bold text-primary">82%</p>
          <p className="text-green-600 font-semibold">Excellent Performance!</p>
        </Card>

        {/* Answers Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Your Answers</h2>
          
          {[1, 2, 3].map((q) => (
            <Card key={q} className="p-6 border border-border space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-foreground">Question {q}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Tell us about your biggest project achievement..."
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">Score: 85/100</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Your Answer:</span> During my internship at XYZ Company, I led the development of a mobile application that increased user engagement by 40%...
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Analytics */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Analytics & Feedback</h2>
          
          {/* Skill Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border border-border space-y-4">
              <h3 className="font-semibold text-foreground">Communication Skills</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Clarity</span>
                  <span className="font-medium">88%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Pace</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border space-y-4">
              <h3 className="font-semibold text-foreground">Technical Knowledge</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Problem Solving</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Knowledge Depth</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </Card>
          </div>

          {/* Confidence Meter */}
          <Card className="p-6 border border-border space-y-4">
            <h3 className="font-semibold text-foreground">Confidence Meter</h3>
            <div className="space-y-4">
              {['First Answer', 'Second Answer', 'Third Answer'].map((ans, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{ans}</span>
                    <span className="font-medium">{80 + i * 3}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${80 + i * 3}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Suggestions */}
        <Card className="p-6 border border-blue-200 bg-blue-50 space-y-4">
          <h3 className="font-semibold text-blue-900">Improvement Suggestions</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Try to maintain a steady pace when answering questions</li>
            <li>• Add more technical depth to your explanations</li>
            <li>• Practice answering behavioral questions with the STAR method</li>
            <li>• Improve eye contact with the camera during responses</li>
          </ul>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center pt-8 border-t border-border">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            Share Results
          </Button>
          <Link href="/student/interview">
            <Button variant="outline">
              Try Another Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
