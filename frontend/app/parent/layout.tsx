import React from "react"
import { ParentSidebar } from '@/components/parent/sidebar'
import { ParentTopbar } from '@/components/parent/topbar'

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <ParentSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ParentTopbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
