'use client'

import { useState, useEffect } from 'react'
import API from "@/lib/api"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookOpen, Download, Calendar } from 'lucide-react'

export default function ParentMaterialsPage() {

  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState("")
  const [materials, setMaterials] = useState<any[]>([])

  // Fetch children
  useEffect(() => {
    const fetchChildren = async () => {
      const res = await API.get("/parent/dashboard")
      setChildren(res.data)
      if (res.data.length > 0) {
        setSelectedChild(res.data[0]._id)
      }
    }
    fetchChildren()
  }, [])

  // Fetch materials when child changes
  useEffect(() => {
    if (!selectedChild) return

    const fetchMaterials = async () => {
      const res = await API.get(`/parent/child-materials/${selectedChild}`)
      setMaterials(res.data)
    }

    fetchMaterials()
  }, [selectedChild])

  return (
<div className="space-y-6 p-6">
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground transition-all duration-500">Learning Materials</h1>
        <p className="text-muted-foreground text-lg transition-all duration-300">
          Review materials shared by your children's instructors
        </p>
      </div>

      {/* Child Selector */}
      <Select value={selectedChild} onValueChange={setSelectedChild}>
        <SelectTrigger className="w-64 transition-all duration-300 hover:shadow-md">
          <SelectValue placeholder="Select Child" />
        </SelectTrigger>
        <SelectContent>
          {children.map((child) => (
            <SelectItem key={child._id} value={child._id} className="transition-all duration-200 hover:bg-primary/10">
              {child.fullName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid gap-4">
        {materials.map((material) => (
          <Card key={material._id} className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-slide-in">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="rounded-lg bg-primary/10 p-3 transition-all duration-300 hover:bg-primary/20">
                  <BookOpen className="h-6 w-6 text-primary transition-all duration-300 hover:scale-110" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg transition-all duration-300">{material.title}</h3>
                  <p className="text-sm text-muted-foreground transition-all duration-300">{material.description}</p>
                  <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                    <span>By {material.faculty?.fullName}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 transition-all duration-300 hover:text-primary" />
                      {new Date(material.createdAt).toLocaleDateString()}
                    </div>
                    <span>{(material.fileSize / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              </div>

              <Button
  onClick={async () => {
    try {
      const res = await API.get(
        `/parent/child-materials/download/${selectedChild}/${material._id}`,
        { responseType: "blob" }
      )

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", material.fileName)
      document.body.appendChild(link)
      link.click()
    } catch (err) {
      alert("Download failed")
    }
  }}
  className="transition-all duration-300 hover:bg-primary/80 hover:scale-105 active:scale-95"
>
  Download
</Button>

            </div>
          </Card>
        ))}
      </div>
    </div>

  )
}
