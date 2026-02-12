'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { StudentRegister } from '@/components/auth/student-register'
import { FacultyRegister } from '@/components/auth/faculty-register'
import { ParentRegister } from '@/components/auth/parent-register'

function RegisterContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'student'

  const renderForm = () => {
    switch (role) {
      case 'student':
        return <StudentRegister />
      case 'faculty':
        return <FacultyRegister />
      case 'parent':
        return <ParentRegister />
      default:
        return <StudentRegister />
    }
  }

  return renderForm()
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
