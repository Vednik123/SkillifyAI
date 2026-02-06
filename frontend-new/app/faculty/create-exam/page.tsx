'use client'

import React from "react"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, Wand2 } from 'lucide-react'

export default function CreateExamPage() {
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [notesFile, setNotesFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [quizGenerated, setQuizGenerated] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null)

  // Sample generated questions
  const sampleQuestions = [
    { id: 1, question: 'What is integration?', type: 'short' },
    { id: 2, question: 'Solve: ∫(2x + 3)dx', type: 'short' },
    { id: 3, question: 'Find the indefinite integral', type: 'multiple', options: ['A', 'B', 'C', 'D'] },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNotesFile(e.target.files[0])
    }
  }

  const handleGenerateQuiz = () => {
    if (topic && subject && difficulty) {
      setIsGenerating(true)
      setTimeout(() => {
        setGeneratedQuiz({
          topic,
          subject,
          difficulty,
          questions: sampleQuestions,
          scheduledDate,
          scheduledTime,
        })
        setQuizGenerated(true)
        setIsGenerating(false)
      }, 1500)
    }
  }

  const handleAssignQuiz = () => {
    alert(`Quiz "${topic}" assigned to all students successfully!`)
    setQuizGenerated(false)
    setGeneratedQuiz(null)
    setTopic('')
    setDescription('')
    setSubject('')
    setDifficulty('')
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Exam</h1>
        <p className="text-muted-foreground mt-2">Upload notes and generate an AI-powered quiz</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Notes */}
          <Card className="p-8 border border-border space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Upload Study Notes</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-3 hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-muted-foreground/30 mx-auto" />
              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <p className="font-medium text-foreground">Click to upload notes</p>
                  <p className="text-sm text-muted-foreground">or drag and drop</p>
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">Supports PDF, DOC, DOCX, TXT</p>
              {notesFile && (
                <p className="text-sm text-green-600 font-semibold">✓ {notesFile.name}</p>
              )}
            </div>
          </Card>

          {/* Exam Details */}
          <Card className="p-8 border border-border space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Exam Details</h2>

            <form className="space-y-6">
              {/* Topic */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium text-foreground">
                  Topic <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="e.g., Calculus - Integration"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  className="h-10 border-border bg-background"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter exam description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-border bg-background min-h-24"
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Difficulty Level <span className="text-red-500">*</span>
                </Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Schedule Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-foreground">
                    Scheduled Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="h-10 border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium text-foreground">
                    Scheduled Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="h-10 border-border bg-background"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button
                type="button"
                onClick={handleGenerateQuiz}
                disabled={!topic || !subject || !difficulty || isGenerating}
                className="w-full bg-primary hover:bg-primary/90 h-11 gap-2 font-semibold"
              >
                <Wand2 className="w-4 h-4" />
                {isGenerating ? 'Generating Quiz...' : 'Generate Quiz with AI'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* How It Works */}
          <Card className="p-6 border border-border space-y-4">
            <h3 className="font-semibold text-foreground">How It Works</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">1.</span>
                <span>Upload your study notes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">2.</span>
                <span>Enter exam details</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">3.</span>
                <span>AI generates questions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">4.</span>
                <span>Review and assign to students</span>
              </li>
            </ol>
          </Card>

          {/* Features */}
          <Card className="p-6 border border-green-200 bg-green-50 space-y-3">
            <h3 className="font-semibold text-green-900">Features</h3>
            <ul className="space-y-2 text-xs text-green-800">
              <li>✓ AI-generated questions</li>
              <li>✓ Auto proctoring setup</li>
              <li>✓ Scheduled distribution</li>
              <li>✓ Real-time monitoring</li>
              <li>✓ Instant grading</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Quiz Preview Modal */}
      {quizGenerated && generatedQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-2xl p-8 border border-border my-8">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Quiz Preview</h2>
                  <p className="text-sm text-muted-foreground mt-1">Review before assigning to students</p>
                </div>
                <button 
                  onClick={() => setQuizGenerated(false)}
                  className="text-2xl text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>

              {/* Quiz Details */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Topic</p>
                  <p className="font-semibold text-foreground">{generatedQuiz.topic}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subject</p>
                  <p className="font-semibold text-foreground capitalize">{generatedQuiz.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                  <p className="font-semibold text-foreground capitalize">{generatedQuiz.difficulty}</p>
                </div>
              </div>

              {/* Questions Preview */}
              <div className="space-y-3 max-h-96 overflow-y-auto border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-4">Generated Questions ({generatedQuiz.questions.length})</h3>
                {generatedQuiz.questions.map((q: any, idx: number) => (
                  <div key={q.id} className="p-3 bg-secondary/50 rounded-lg border border-border">
                    <p className="font-medium text-sm text-foreground">Q{idx + 1}: {q.question}</p>
                    {q.options && (
                      <div className="mt-2 ml-4 space-y-1">
                        {q.options.map((opt: string, i: number) => (
                          <p key={i} className="text-xs text-muted-foreground">{String.fromCharCode(65 + i)}) {opt}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Scheduled Info */}
              {generatedQuiz.scheduledDate && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Scheduled for:</strong> {generatedQuiz.scheduledDate} at {generatedQuiz.scheduledTime || 'Not specified'}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={handleAssignQuiz}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Assign to Students
                </Button>
                <Button 
                  onClick={() => setQuizGenerated(false)}
                  variant="outline" 
                  className="flex-1"
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
