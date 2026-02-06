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
import { Award, ExternalLink } from 'lucide-react'

const availableCertifications = [
  {
    id: 1,
    name: 'Python Basics',
    platform: 'Coursera',
    difficulty: 'Beginner',
    duration: '4 weeks',
    description: 'Learn Python fundamentals including variables, loops, and functions',
  },
  {
    id: 2,
    name: 'Advanced Python',
    platform: 'Udemy',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    description: 'Master advanced Python concepts including OOP, decorators, and async programming',
  },
  {
    id: 3,
    name: 'Full Stack Web Development',
    platform: 'edX',
    difficulty: 'Advanced',
    duration: '12 weeks',
    description: 'Build complete web applications with modern technologies',
  },
  {
    id: 4,
    name: 'Mathematics for Data Science',
    platform: 'Coursera',
    difficulty: 'Intermediate',
    duration: '6 weeks',
    description: 'Essential math concepts for data science and machine learning',
  },
  {
    id: 5,
    name: 'Machine Learning Fundamentals',
    platform: 'Udacity',
    difficulty: 'Advanced',
    duration: '10 weeks',
    description: 'Introduction to machine learning algorithms and applications',
  },
  {
    id: 6,
    name: 'Digital Marketing Essentials',
    platform: 'Google',
    difficulty: 'Beginner',
    duration: '2 weeks',
    description: 'Learn digital marketing strategies and tools',
  },
]

const earnedCertifications = [
  {
    id: 1,
    name: 'Advanced Python',
    platform: 'Udemy',
    earnedDate: 'February 28, 2024',
    certificateId: 'CERT-2024-001',
  },
  {
    id: 2,
    name: 'Python Basics',
    platform: 'Coursera',
    earnedDate: 'January 15, 2024',
    certificateId: 'CERT-2024-002',
  },
  {
    id: 3,
    name: 'Mathematics for Data Science',
    platform: 'Coursera',
    earnedDate: 'December 20, 2023',
    certificateId: 'CERT-2023-003',
  },
  {
    id: 4,
    name: 'Digital Marketing Essentials',
    platform: 'Google',
    earnedDate: 'November 10, 2023',
    certificateId: 'CERT-2023-004',
  },
  {
    id: 5,
    name: 'Data Analysis Fundamentals',
    platform: 'Udacity',
    earnedDate: 'October 5, 2023',
    certificateId: 'CERT-2023-005',
  },
]

export default function CertificationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null)

  const filteredCertifications = availableCertifications.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.platform.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || cert.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="p-8 space-y-12">
      {/* Earned Certifications */}
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certifications</h1>
          <p className="text-muted-foreground mt-2">Track your earned certificates and explore new learning opportunities</p>
        </div>

        {/* Earned Certificates */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">My Certificates ({earnedCertifications.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedCertifications.map((cert) => (
              <Card key={cert.id} className="p-6 border border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-foreground">{cert.name}</p>
                      <p className="text-xs text-muted-foreground">{cert.platform}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded p-3 text-xs text-muted-foreground">
                    <p>ID: {cert.certificateId}</p>
                    <p>Earned: {cert.earnedDate}</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setSelectedCertificate(cert)
                      setShowCertificateModal(true)
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-9"
                  >
                    View Certificate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Available Certifications */}
      <section className="space-y-6 border-t border-border pt-12">
        <h2 className="text-2xl font-semibold text-foreground">Available Certifications</h2>

        {/* Search and Filter */}
        <Card className="p-6 border border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search Certifications</label>
              <Input
                placeholder="Search by name or platform..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Filter by Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="h-10 border-border bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Certification Cards */}
        {filteredCertifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertifications.map((cert) => (
              <Card key={cert.id} className="p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 group">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{cert.platform}</p>
                  </div>

                  <p className="text-sm text-muted-foreground">{cert.description}</p>

                  <div className="flex gap-2 flex-wrap py-2">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                      {cert.difficulty}
                    </span>
                    <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded">
                      {cert.duration}
                    </span>
                  </div>

                  <Button 
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(cert.name + ' ' + cert.platform)}`, '_blank')}
                    className="w-full bg-primary hover:bg-primary/90 text-sm h-9 gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Enroll Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 border border-border text-center">
            <p className="text-muted-foreground">No certifications found matching your criteria.</p>
          </Card>
        )}
      </section>

      {/* Certificate Modal */}
      {showCertificateModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl p-8 border border-border">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-foreground">Certificate</h2>
                <button 
                  onClick={() => setShowCertificateModal(false)}
                  className="text-2xl text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
              
              <div className="border-2 border-dashed border-primary p-12 rounded-lg text-center space-y-4 bg-primary/5">
                <div className="text-6xl">🎓</div>
                <h3 className="text-2xl font-bold text-foreground">{selectedCertificate.name}</h3>
                <p className="text-lg text-muted-foreground">{selectedCertificate.platform}</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Certificate ID: {selectedCertificate.certificateId}</p>
                  <p>Earned Date: {selectedCertificate.earnedDate}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button className="flex-1 bg-primary hover:bg-primary/90 gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button 
                  onClick={() => setShowCertificateModal(false)}
                  variant="outline" 
                  className="flex-1"
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
