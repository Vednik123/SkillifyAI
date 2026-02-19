'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock } from 'lucide-react'
import * as faceapi from 'face-api.js'
import { loadFaceModels } from '@/lib/faceApi'

/* ================= CAMERA PREVIEW ================= */

function CameraPreview({
  active,
  onFrame,
}: {
  active: boolean
  onFrame: (payload: { embedding: number[] }) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  

  useEffect(() => {
    if (!active) return

    let stopped = false

    const startCamera = async () => {
      try {
        await loadFaceModels()

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
          audio: false,
        })

        if (stopped) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream

        intervalRef.current = setInterval(async () => {
          if (!videoRef.current || stopped) return

          const detection = await faceapi
            .detectSingleFace(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptor()

          // 🔥 NO FACE = EMPTY ARRAY (IMPORTANT)
          onFrame({
            embedding: detection ? Array.from(detection.descriptor) : [],
          })
        }, 6000)
      } catch {
        alert('Camera permission required')
      }
    }

    startCamera()

    return () => {
      stopped = true
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop())
      if (videoRef.current) videoRef.current.srcObject = null
    }
  }, [active])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="w-44 h-32 rounded-lg overflow-hidden border bg-black shadow">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
          Camera On
        </div>
      </div>
    </div>
  )
}

/* ================= QUIZ PAGE ================= */

export default function QuizTakePage() {
  const router = useRouter()
  const params = useSearchParams()

  const subject = params.get('subject') || 'General'
  const time = Number(params.get('time') || 30)
  const questionsCount = Number(params.get('questions') || 10)

  const [questions, setQuestions] = useState<any[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(time * 60)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [warnings, setWarnings] = useState({ tab: 0, face: 0 })
  const [warningMsg, setWarningMsg] = useState<string | null>(null)

  const answersRef = useRef<any[]>([])
  const isSubmittingRef = useRef(false)
  const restoringFullscreenRef = useRef(false)
  const totalWarningsRef = useRef(0)

  const incrementWarning = (msg: string) => {
  totalWarningsRef.current = Math.min(totalWarningsRef.current + 1, 3)

  setWarningMsg(msg)
  setTimeout(() => setWarningMsg(null), 2000)

  if (totalWarningsRef.current >= 3) {
    submit('PROCTOR_VIOLATION')
  }
}

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  /* ---------- START QUIZ ---------- */

  useEffect(() => {
    const start = async () => {
      const res = await fetch('http://localhost:5000/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          questions: questionsCount,
          difficulty: 'mixed',
        }),
      })

      const data = await res.json()
      const qs = data.questions || []

      setQuestions(qs)
      setSelectedAnswers(new Array(qs.length).fill(null))

      answersRef.current = qs.map((q: any, i: number) => ({
        questionId: q.id || `q_${i + 1}`,
        selectedIndex: null,
      }))

      const attemptRes = await fetch(
        'http://localhost:5000/api/quiz/attempt/start',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quizType: 'CUSTOM',
            questions: qs.map((q: any, i: number) => ({
              questionId: q.id || `q_${i + 1}`,
              question: q.question,
              options: q.options,
              correctAnswer: q.correct,
            })),
          }),
        }
      )

      const attempt = await attemptRes.json()
      setAttemptId(attempt.attemptId)
      setLoading(false)
    }

    start()
  }, [])

  /* ---------- FULLSCREEN ON START ---------- */

  // useEffect(() => {
  //   if (!attemptId) return
  //   document.documentElement.requestFullscreen?.()
  // }, [attemptId])

  /* ---------- ESC / FULLSCREEN EXIT ---------- */
useEffect(() => {
  if (!attemptId) return

  const onFullscreenChange = async () => {
    if (
      !document.fullscreenElement &&
      !isSubmittingRef.current &&
      !restoringFullscreenRef.current
    ) {
      restoringFullscreenRef.current = true

      // 🔴 warning
      const res = await fetch(
        'http://localhost:5000/api/quiz/attempt/warning',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attemptId,
            type: 'TAB', // ESC = TAB
            answers: answersRef.current,
          }),
        }
      )

      const data = await res.json()

      incrementWarning('Fullscreen exit detected (ESC pressed)')

      if (data?.autoSubmitted) {
        submit('PROCTOR_VIOLATION')
        return
      }

      // 🔒 restore fullscreen ONLY HERE
      setTimeout(() => {
        document.documentElement
          .requestFullscreen()
          .catch(() => {})
          .finally(() => {
            restoringFullscreenRef.current = false
          })
      }, 500)
    }
  }

  document.addEventListener('fullscreenchange', onFullscreenChange)
  return () =>
    document.removeEventListener('fullscreenchange', onFullscreenChange)
}, [attemptId])
  /* ---------- TAB SWITCH ---------- */

 useEffect(() => {
  if (!attemptId) return

  const onVisibility = async () => {
    if (document.hidden && !isSubmittingRef.current) {
      const res = await fetch(
        'http://localhost:5000/api/quiz/attempt/warning',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attemptId,
            type: 'TAB',
            answers: answersRef.current,
          }),
        }
      )

      const data = await res.json()

      incrementWarning('Tab switching detected')

      if (data?.autoSubmitted) {
        submit('PROCTOR_VIOLATION')
        return
      }

      // 🔒 restore fullscreen
      // setTimeout(() => {
      //   document.documentElement.requestFullscreen?.().catch(() => {})
      // }, 300)
    }
  }

  document.addEventListener('visibilitychange', onVisibility)
  return () =>
    document.removeEventListener('visibilitychange', onVisibility)
}, [attemptId])

  /* ---------- ANSWERS ---------- */

  const hasEnteredFullscreenRef = useRef(false)

const updateAnswer = (idx: number) => {
  // ✅ Fullscreen on first interaction
  if (!hasEnteredFullscreenRef.current) {
    document.documentElement.requestFullscreen?.().catch(() => {})
    hasEnteredFullscreenRef.current = true
  }

  const copy = [...selectedAnswers]
  copy[currentQuestion] = idx
  setSelectedAnswers(copy)

  answersRef.current[currentQuestion].selectedIndex = idx
}

  /* ---------- SUBMIT ---------- */

  const submit = async (reason = 'NORMAL') => {
  if (!attemptId || isSubmittingRef.current) return
  isSubmittingRef.current = true

  // ✅ SAFE fullscreen exit
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen()
    } catch {
      // ignore
    }
  }

  await fetch('http://localhost:5000/api/quiz/submit', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      quizAttemptId: attemptId,
      answers: answersRef.current,
      submitReason: reason,
    }),
  })

  router.replace(`/student/quiz/results?attemptId=${attemptId}`)
}

  /* ---------- FACE CHECK ---------- */

  const handleFaceFrame = useCallback(
    async ({ embedding }: { embedding: number[] }) => {
      if (!attemptId || isSubmittingRef.current) return

      const res = await fetch(
        'http://localhost:5000/api/proctor/face-check',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attemptId,
            embedding,
            answers: answersRef.current,
          }),
        }
      )

      const data = await res.json()

      if (data?.faceMismatch || embedding.length === 0) {
        incrementWarning('Face not detected / mismatch')
      }

      if (data?.autoSubmitted) submit('PROCTOR_VIOLATION')
    },
    [attemptId]
  )

  /* ---------- TIMER ---------- */

useEffect(() => {
  if (!attemptId) return

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        if (!isSubmittingRef.current) {
          submit('TIME_UP')
        }
        return 0
      }
      return prev - 1
    })
  }, 1000)

  return () => clearInterval(timer)
}, [attemptId])

  /* ---------- UI ---------- */

  if (loading) return <div className="p-8">Generating quiz...</div>

  const q = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  

  return (
    <div className="p-8 space-y-6 relative">
      {warningMsg && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded z-50">
          ⚠️ {warningMsg} ({totalWarningsRef.current}/3)
        </div>
      )}

      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Clock />
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
        Question {currentQuestion + 1}/{questions.length}
      </div>

      <Progress value={progress} />

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">{q.question}</h2>
        {q.options.map((opt: string, idx: number) => (
          <button
            key={idx}
            onClick={() => updateAnswer(idx)}
            className={`w-full p-3 border rounded ${
              selectedAnswers[currentQuestion] === idx
                ? 'bg-primary/10 border-primary'
                : ''
            }`}
          >
            {opt}
          </button>
        ))}
      </Card>

      <div className="flex justify-between">
        <Button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion((c) => c - 1)}>
          Previous
        </Button>

        {currentQuestion === questions.length - 1 ? (
          <Button onClick={() => submit()}>Submit</Button>
        ) : (
          <Button onClick={() => setCurrentQuestion((c) => c + 1)}>Next</Button>
        )}
      </div>

      <CameraPreview active={!!attemptId} onFrame={handleFaceFrame} />
    </div>
  )
}