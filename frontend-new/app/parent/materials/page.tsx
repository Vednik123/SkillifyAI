'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Download, Calendar } from 'lucide-react'

export default function ParentMaterialsPage() {
  const materials = [
    {
      id: 1,
      title: 'Algebra Fundamentals',
      subject: 'Mathematics',
      uploadedBy: 'Prof. Smith',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: 'Shakespeare\'s Works',
      subject: 'English Literature',
      uploadedBy: 'Prof. Johnson',
      uploadDate: '2024-01-12',
      size: '1.8 MB',
    },
    {
      id: 3,
      title: 'Physics Lab Manual',
      subject: 'Physics',
      uploadedBy: 'Prof. Williams',
      uploadDate: '2024-01-10',
      size: '3.2 MB',
    },
    {
      id: 4,
      title: 'World History Notes',
      subject: 'History',
      uploadedBy: 'Prof. Davis',
      uploadDate: '2024-01-08',
      size: '1.5 MB',
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Learning Materials</h1>
        <p className="text-muted-foreground">Review materials shared by your children's instructors</p>
      </div>

      <div className="grid gap-4">
        {materials.map((material) => (
          <Card key={material.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{material.title}</h3>
                  <p className="text-sm text-muted-foreground">{material.subject}</p>
                  <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                    <span>By {material.uploadedBy}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(material.uploadDate).toLocaleDateString()}
                    </div>
                    <span>{material.size}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
