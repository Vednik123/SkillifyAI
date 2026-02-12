'use client'

import React from "react"

import { FacultySidebar } from '@/components/faculty/sidebar'
import { FacultyTopbar } from '@/components/faculty/topbar'

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <FacultyTopbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
