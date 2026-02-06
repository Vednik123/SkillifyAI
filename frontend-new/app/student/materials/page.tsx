'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, Download, Calendar } from 'lucide-react'

const materialsData = [
  {
    id: 1,
    title: 'Calculus Fundamentals - Chapter 5',
    subject: 'Mathematics',
    uploadedBy: 'Prof. Smith',
    uploadDate: 'Mar 15, 2024',
    size: '2.4 MB',
  },
  {
    id: 2,
    title: 'Quantum Physics Introduction',
    subject: 'Physics',
    uploadedBy: 'Prof. Johnson',
    uploadDate: 'Mar 14, 2024',
    size: '5.1 MB',
  },
  {
    id: 3,
    title: 'English Literature Summary',
    subject: 'English',
    uploadedBy: 'Prof. Brown',
    uploadDate: 'Mar 12, 2024',
    size: '1.8 MB',
  },
  {
    id: 4,
    title: 'World History Notes - WWI Era',
    subject: 'History',
    uploadedBy: 'Prof. Davis',
    uploadDate: 'Mar 10, 2024',
    size: '3.2 MB',
  },
  {
    id: 5,
    title: 'Biology Cell Structures',
    subject: 'Science',
    uploadedBy: 'Prof. Miller',
    uploadDate: 'Mar 8, 2024',
    size: '4.7 MB',
  },
  {
    id: 6,
    title: 'Python Advanced Concepts',
    subject: 'Computer Science',
    uploadedBy: 'Prof. Wilson',
    uploadDate: 'Mar 5, 2024',
    size: '2.1 MB',
  },
]

export default function MaterialsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')

  const subjects = ['all', 'Mathematics', 'Physics', 'English', 'History', 'Science', 'Computer Science']

  const filteredMaterials = materialsData.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Learning Materials</h1>
        <p className="text-muted-foreground mt-2">Access all study materials uploaded by faculty</p>
      </div>

      {/* Search and Filter */}
      <Card className="p-6 border border-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Search Materials</label>
            <Input
              placeholder="Search by title or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 border-border bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Filter by Subject</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="h-10 border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Materials Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card
              key={material.id}
              className="p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Icon and Subject */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                    {material.subject}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {material.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">by {material.uploadedBy}</p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground py-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{material.uploadDate}</span>
                  </div>
                  <span>{material.size}</span>
                </div>

                {/* Download Button */}
                <Button className="w-full bg-primary hover:bg-primary/90 text-sm h-9 gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 border border-border text-center">
          <p className="text-muted-foreground">No materials found matching your criteria.</p>
        </Card>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredMaterials.length} of {materialsData.length} materials
      </div>
    </div>
  )
}
