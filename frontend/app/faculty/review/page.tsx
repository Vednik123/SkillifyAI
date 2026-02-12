'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Eye } from 'lucide-react'

const submissions = [
  {
    id: 1,
    student: 'John Doe',
    subject: 'Mathematics',
    aiScore: 85,
    submitted: 'March 18, 2024',
    status: 'pending',
  },
  {
    id: 2,
    student: 'Jane Smith',
    subject: 'Physics',
    aiScore: 78,
    submitted: 'March 17, 2024',
    status: 'pending',
  },
  {
    id: 3,
    student: 'Bob Johnson',
    subject: 'Chemistry',
    aiScore: 92,
    submitted: 'March 16, 2024',
    status: 'reviewed',
    facultyScore: 94,
  },
  {
    id: 4,
    student: 'Alice Brown',
    subject: 'Biology',
    aiScore: 88,
    submitted: 'March 15, 2024',
    status: 'reviewed',
    facultyScore: 90,
  },
]

export default function ReviewPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<typeof submissions[0] | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [facultyScore, setFacultyScore] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleReviewClick = (submission: typeof submissions[0]) => {
    setSelectedSubmission(submission)
    setShowReviewModal(true)
    setFacultyScore(submission.facultyScore?.toString() || '')
  }

  const handleSubmitReview = () => {
    if (facultyScore) {
      alert(`Review submitted for ${selectedSubmission?.student}!\nScore: ${facultyScore}/100`)
      setShowReviewModal(false)
      setSelectedSubmission(null)
      setFacultyScore('')
      setFeedback('')
    }
  }

  const handleCloseModal = () => {
    setShowReviewModal(false)
    setSelectedSubmission(null)
    setFacultyScore('')
    setFeedback('')
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Submissions Review</h1>
        <p className="text-muted-foreground mt-2">Review and provide feedback on student submissions</p>
      </div>

      {/* Submissions Table */}
      <Card className="p-6 border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 font-semibold text-foreground">Student</th>
              <th className="text-left py-3 font-semibold text-foreground">Subject</th>
              <th className="text-left py-3 font-semibold text-foreground">AI Score</th>
              <th className="text-left py-3 font-semibold text-foreground">Faculty Score</th>
              <th className="text-left py-3 font-semibold text-foreground">Submitted</th>
              <th className="text-left py-3 font-semibold text-foreground">Status</th>
              <th className="text-left py-3 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="py-3 text-foreground font-medium">{submission.student}</td>
                <td className="py-3 text-muted-foreground">{submission.subject}</td>
                <td className="py-3 text-muted-foreground">{submission.aiScore}%</td>
                <td className="py-3 text-muted-foreground">
                  {'facultyScore' in submission ? `${submission.facultyScore}%` : '-'}
                </td>
                <td className="py-3 text-muted-foreground text-xs">{submission.submitted}</td>
                <td className="py-3">
                  <Badge className={submission.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {submission.status === 'reviewed' ? 'Reviewed' : 'Pending'}
                  </Badge>
                </td>
                <td className="py-3">
                  <Button
                    onClick={() => handleReviewClick(submission)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Review Modal */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-2xl p-8 border border-border my-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Review Student Submission</h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-2xl text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>

              {/* Submission Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Student Name</p>
                  <p className="font-semibold text-foreground">{selectedSubmission.student}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subject</p>
                  <p className="font-semibold text-foreground">{selectedSubmission.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">AI Score</p>
                  <p className="font-semibold text-foreground">{selectedSubmission.aiScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="font-semibold text-foreground text-sm">{selectedSubmission.submitted}</p>
                </div>
              </div>

              {/* Student Answers */}
              <div className="space-y-4 p-4 border border-border rounded-lg bg-secondary/50">
                <h3 className="font-semibold text-foreground">Student Answers</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Question 1: What is the capital of France?</p>
                    <p className="text-foreground">Answer: Paris</p>
                    <p className="text-green-600 text-xs mt-1">✓ Correct</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-muted-foreground mb-1">Question 2: Explain photosynthesis in 2 sentences</p>
                    <p className="text-foreground">Answer: Photosynthesis is the process where plants convert sunlight into chemical energy. This energy is used to fuel the plant's growth.</p>
                    <p className="text-yellow-600 text-xs mt-1">⚠ Partial - Could be more detailed</p>
                  </div>
                </div>
              </div>

              {/* Faculty Score */}
              <div className="space-y-2">
                <Label htmlFor="facultyScore" className="text-sm font-medium text-foreground">
                  Your Score (0-100) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="facultyScore"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter score"
                  value={facultyScore}
                  onChange={(e) => setFacultyScore(e.target.value)}
                  className="h-10 border-border bg-background"
                />
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <Label htmlFor="feedback" className="text-sm font-medium text-foreground">
                  Feedback (Optional)
                </Label>
                <textarea
                  id="feedback"
                  placeholder="Provide constructive feedback for the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSubmitReview}
                  disabled={!facultyScore}
                  className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit Review
                </Button>
                <Button 
                  onClick={handleCloseModal}
                  variant="outline" 
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
