'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Download, Calendar } from 'lucide-react'

export default function ParentCertificationsPage() {
  const certifications = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      issuer: 'SkillifyAI',
      date: '2024-01-20',
      status: 'completed',
      score: 92,
    },
    {
      id: 2,
      title: 'English Proficiency',
      issuer: 'SkillifyAI',
      date: '2024-01-15',
      status: 'completed',
      score: 88,
    },
    {
      id: 3,
      title: 'Science Excellence',
      issuer: 'SkillifyAI',
      date: '2024-02-05',
      status: 'in-progress',
      score: 75,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Certifications</h1>
        <p className="text-muted-foreground">Track your children's earned certifications</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Completed Certifications</p>
          <p className="mt-2 text-3xl font-bold text-foreground">2</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="mt-2 text-3xl font-bold text-foreground">1</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Average Score</p>
          <p className="mt-2 text-3xl font-bold text-foreground">85%</p>
        </Card>
      </div>

      <div className="space-y-4">
        {certifications.map((cert) => (
          <Card key={cert.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="rounded-lg bg-yellow-100 p-3">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">Issued by {cert.issuer}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <Badge
                      variant={cert.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {cert.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(cert.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{cert.score}%</p>
                {cert.status === 'completed' && (
                  <button className="mt-2 flex items-center gap-2 text-primary hover:underline">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
