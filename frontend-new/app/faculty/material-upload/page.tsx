'use client'

import React from "react"

import { useState } from 'react'
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
import { Upload, X } from 'lucide-react'

export default function MaterialUploadPage() {
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
    }
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (topic && subject && uploadedFiles.length > 0) {
      alert(`Uploaded ${uploadedFiles.length} file(s) for ${subject}`)
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload Learning Materials</h1>
        <p className="text-muted-foreground mt-2">Share study notes and resources with students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* File Upload */}
          <Card className="p-8 border border-border space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Upload Files</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center space-y-3 hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-muted-foreground/30 mx-auto" />
              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <p className="font-medium text-foreground">Click to upload</p>
                  <p className="text-sm text-muted-foreground">or drag and drop</p>
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">Supports PDF, DOC, PPT, Images</p>
            </div>
          </Card>

          {/* Details */}
          <Card className="p-8 border border-border space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Material Details</h2>

            <form className="space-y-6">
              {/* Topic */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium text-foreground">
                  Topic <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="e.g., Chapter 5 - Integration Methods"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="h-10 border-border bg-background"
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
                  </SelectContent>
                </Select>
              </div>

              {/* Upload Button */}
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!topic || !subject || uploadedFiles.length === 0}
                className="w-full bg-primary hover:bg-primary/90 h-11"
              >
                Upload Materials
              </Button>
            </form>
          </Card>
        </div>

        {/* Uploaded Files Preview */}
        <Card className="p-6 border border-border space-y-4">
          <h3 className="font-semibold text-foreground">Uploaded Files ({uploadedFiles.length})</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded border border-border">
                <span className="text-sm text-foreground truncate">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {uploadedFiles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No files uploaded yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
