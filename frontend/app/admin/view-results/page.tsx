'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Eye, AlertCircle, BookOpen } from 'lucide-react'

export default function ViewResultsPage() {
  const [semesters, setSemesters] = useState<any[]>([])
  const [selectedSemester, setSelectedSemester] = useState('')
  const [searchId, setSearchId] = useState('')
  const [results, setResults] = useState<any>({ examAttempts: [], quizAttempts: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  useEffect(() => {
    fetchSemesters()
  }, [])

  const fetchSemesters = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/semesters/list', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSemesters(data || [])
    } catch (err) {
      setError('Failed to fetch semesters')
    }
  }

  const fetchResults = async () => {
    if (!selectedSemester) {
      setError('Select a semester')
      return
    }

    setLoading(true)
    setError('')
    setHasSearched(true)
    try {
      const res = await fetch(`http://localhost:5000/api/admin/semesters/${selectedSemester}/results`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setResults(data || { examAttempts: [], quizAttempts: [] })
    } catch (err) {
      setError('Failed to fetch results')
      setResults({ examAttempts: [], quizAttempts: [] })
    } finally {
      setLoading(false)
    }
  }

  const filteredExamAttempts = (results.examAttempts || []).filter(
    (r: any) => !searchId || String(r.student?.studentId || r.student?._id).includes(searchId)
  )

  const filteredQuizAttempts = (results.quizAttempts || []).filter(
    (r: any) => !searchId || String(r.student?.studentId || r.student?._id).includes(searchId)
  )

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">View Results</h2>
          </div>
          <p className="text-muted-foreground">Search and view all student marksheets for a semester</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="semester-select" className="mb-2 block font-semibold">
              Select Semester *
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                id="semester-select"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="flex-1 border border-border rounded-lg p-2 bg-background"
                disabled={loading}
              >
                <option value="">Choose a semester...</option>
                {semesters.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                    {s.hasResultsDeclared ? ' (✓)' : ' (⏳)'}
                  </option>
                ))}
              </select>
              <Button
                onClick={fetchResults}
                disabled={loading || !selectedSemester}
                className="bg-primary hover:bg-primary/90 min-w-fit"
              >
                {loading ? 'Loading...' : 'Fetch Results'}
              </Button>
            </div>
          </div>

          {hasSearched && (
            <div>
              <Label htmlFor="search-id" className="mb-2 block">
                Search by Student ID (Optional)
              </Label>
              <Input
                id="search-id"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter student ID to filter results..."
                className="border-border"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Results Display */}
      {hasSearched && (
        <div className="space-y-6">
          {/* Exam Attempts */}
          <Card className="p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Exam Attempts</h3>
              </div>
              <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {filteredExamAttempts.length}
              </span>
            </div>

            {filteredExamAttempts.length > 0 ? (
              <div className="space-y-3">
                {filteredExamAttempts.map((attempt: any) => (
                  <div
                    key={attempt._id}
                    className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-lg">{attempt.exam?.title || 'Exam'}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Student:</span>{' '}
                            <span className="font-medium">{attempt.student?.fullName || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ID:</span>{' '}
                            <span className="font-medium">{attempt.student?.studentId || attempt.student?._id}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Score:</span>{' '}
                            <span className="font-bold text-green-600">
                              {attempt.score}/{attempt.totalQuestions}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Submitted:</span>{' '}
                            <span className="text-xs">
                              {new Date(attempt.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/student/quiz/scheduled/results/${attempt._id}`}>
                        <Button variant="outline" size="sm" className="min-w-fit">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No exam attempts found
                {searchId && ` for student ID: ${searchId}`}
              </div>
            )}
          </Card>

          {/* Quiz Attempts */}
          <Card className="p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Quiz Attempts</h3>
              </div>
              <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {filteredQuizAttempts.length}
              </span>
            </div>

            {filteredQuizAttempts.length > 0 ? (
              <div className="space-y-3">
                {filteredQuizAttempts.map((attempt: any) => (
                  <div
                    key={attempt._id}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-lg">
                          {attempt.quizTitle || 'Scheduled Quiz'}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Student:</span>{' '}
                            <span className="font-medium">{attempt.student?.fullName || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ID:</span>{' '}
                            <span className="font-medium">{attempt.student?.studentId || attempt.student?._id}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Score:</span>{' '}
                            <span className="font-bold text-purple-600">
                              {attempt.score}/{attempt.totalQuestions}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Submitted:</span>{' '}
                            <span className="text-xs">
                              {new Date(attempt.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/student/quiz/results?attemptId=${attempt._id}`}>
                        <Button variant="outline" size="sm" className="min-w-fit">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No quiz attempts found
                {searchId && ` for student ID: ${searchId}`}
              </div>
            )}
          </Card>

          {/* Summary */}
          {filteredExamAttempts.length === 0 && filteredQuizAttempts.length === 0 && (
            <Card className="p-6 md:p-8 text-center">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-3 opacity-50" />
              <p className="text-lg text-muted-foreground">No results found for this semester</p>
              {searchId && <p className="text-sm text-muted-foreground mt-2">Try a different student ID</p>}
            </Card>
          )}
        </div>
      )}

      {!hasSearched && selectedSemester && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Click "Fetch Results" to view student attempts</p>
        </Card>
      )}
    </div>
  )
}
