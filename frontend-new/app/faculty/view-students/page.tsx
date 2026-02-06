'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const students = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    studentId: 'STU-001',
    quizzes: 8,
    avgScore: '88%',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    studentId: 'STU-002',
    quizzes: 7,
    avgScore: '92%',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1234567892',
    studentId: 'STU-003',
    quizzes: 5,
    avgScore: '75%',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '+1234567893',
    studentId: 'STU-004',
    quizzes: 9,
    avgScore: '95%',
    status: 'Active',
  },
]

export default function ViewStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewStudent = (student: typeof students[0]) => {
    setSelectedStudent(student)
    setShowModal(true)
  }

  const handleMessageStudent = (student: typeof students[0]) => {
    const message = `Hi ${student.name}, I wanted to check in on your recent quiz performance.`
    const whatsappUrl = `https://wa.me/${student.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">View Students</h1>
        <p className="text-muted-foreground mt-2">Manage and monitor your student progress</p>
      </div>

      {/* Search */}
      <Card className="p-6 border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 border-border bg-background"
          />
        </div>
      </Card>

      {/* Students Table */}
      <Card className="p-6 border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 font-semibold text-foreground">Name</th>
              <th className="text-left py-3 font-semibold text-foreground">Student ID</th>
              <th className="text-left py-3 font-semibold text-foreground">Email</th>
              <th className="text-left py-3 font-semibold text-foreground">Quizzes</th>
              <th className="text-left py-3 font-semibold text-foreground">Avg Score</th>
              <th className="text-left py-3 font-semibold text-foreground">Status</th>
              <th className="text-left py-3 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="py-3 text-foreground font-medium">{student.name}</td>
                <td className="py-3 text-muted-foreground">{student.studentId}</td>
                <td className="py-3 text-muted-foreground text-xs">{student.email}</td>
                <td className="py-3 text-muted-foreground">{student.quizzes}</td>
                <td className="py-3 text-muted-foreground">{student.avgScore}</td>
                <td className="py-3">
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                    {student.status}
                  </span>
                </td>
                <td className="py-3 space-x-2">
                  <Button 
                    onClick={() => handleViewStudent(student)}
                    variant="outline" 
                    size="sm"
                  >
                    View
                  </Button>
                  <Button 
                    onClick={() => handleMessageStudent(student)}
                    variant="outline" 
                    size="sm"
                  >
                    Message
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {filteredStudents.length === 0 && (
        <Card className="p-12 border border-border text-center">
          <p className="text-muted-foreground">No students found matching your search.</p>
        </Card>
      )}

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl p-8 border border-border">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedStudent.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedStudent.studentId}</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-2xl text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-semibold text-foreground">{selectedStudent.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quizzes Completed</p>
                  <p className="font-semibold text-foreground">{selectedStudent.quizzes}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Average Score</p>
                  <p className="font-semibold text-foreground">{selectedStudent.avgScore}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <p className="text-sm"><strong>Status:</strong> {selectedStudent.status}</p>
                <p className="text-sm text-muted-foreground">
                  This student has completed {selectedStudent.quizzes} quizzes with an average score of {selectedStudent.avgScore}.
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
