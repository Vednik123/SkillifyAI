'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import jsPDF from 'jspdf'

export default function MarkSheetsPage(){
  const [semesters, setSemesters] = useState<any[]>([])
  const [selectedSemester, setSelectedSemester] = useState('')
  const [marks, setMarks] = useState<any[]>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  useEffect(()=>{
    fetch('http://localhost:5000/api/student/semesters', { headers: { Authorization: `Bearer ${token}` }})
      .then(r=>r.json()).then(d=>setSemesters(d)).catch(()=>setSemesters([]))
  }, [])

  const fetchMarksheet = async () => {
    if(!selectedSemester) return alert('Select semester')
    try{
      const res = await fetch(`http://localhost:5000/api/student/marksheets/${selectedSemester}`, { headers: { Authorization: `Bearer ${token}` }})
      if(!res.ok) throw new Error('fail')
      const d = await res.json()
      const rows:any[] = []
      // combine examAttempts and quizAttempts into subjects
      (d.examAttempts || []).forEach((a:any)=>{
        rows.push({ subject: a.exam?.title || 'Exam', marks: a.score || 0, total: a.totalQuestions || a.total || 100 })
      })
      (d.quizAttempts || []).forEach((q:any)=>{
        rows.push({ subject: q.quizId || 'Quiz', marks: q.score || 0, total: q.totalQuestions || 100 })
      })
      setMarks(rows)
    }catch(err){ alert('Failed to fetch marksheet') }
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Marksheet', 14, 18)
    doc.setFontSize(12)
    const body = marks.map((r,i)=>[i+1, r.subject, String(r.marks), String(r.total)])
    (doc as any).autoTable({ head:[['#','Subject','Marks','Total']], body, startY: 30 })
    doc.save('marksheet.pdf')
  }

  const percentage = marks.length ? Math.round((marks.reduce((s,a)=>s+Number(a.marks),0)/marks.reduce((s,a)=>s+Number(a.total),0))*100) : 0

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">MarkSheets</h1>

      <Card className="p-4 flex gap-2 items-center">
        <select className="border p-2" value={selectedSemester} onChange={e=>setSelectedSemester(e.target.value)}>
          <option value="">Select semester</option>
          {semesters.map(s=> <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <Button onClick={fetchMarksheet}>Fetch Marksheet</Button>
      </Card>

      {marks.length>0 && (
        <Card className="p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m,i)=> (
                <tr key={i}>
                  <td className="p-2">{i+1}</td>
                  <td className="p-2">{m.subject}</td>
                  <td className="p-2">{m.marks}</td>
                  <td className="p-2">{m.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between items-center">
            <div>Percentage: <strong>{percentage}%</strong></div>
            <div className="flex gap-2">
              <Button onClick={downloadPDF}>Download PDF</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
