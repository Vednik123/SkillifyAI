"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function FacultyOralPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [form, setForm] = useState({
    topic: "",
    date: "",
    time: "",
    duration: "10",
  });

  const [exam, setExam] = useState<any>(null);
  const [scheduledExams, setScheduledExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  /* ================= FETCH SCHEDULED ================= */

  const fetchScheduled = async () => {
    const res = await fetch(`${API}/faculty/oral`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setScheduledExams(data);
  };

  useEffect(() => {
    fetchScheduled();
  }, []);

  /* ================= GENERATE ================= */

  const handleGenerate = async () => {
    setLoading(true);

    const res = await fetch(`${API}/faculty/oral/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        ...form,
        duration: Number(form.duration),
      }),
    });

    const data = await res.json();
    setExam(data);
    setLoading(false);
  };

  /* ================= UPDATE QUESTION ================= */

  const updateQuestion = (index: number, field: string, value: string) => {
    const updated = [...exam.questions];
    updated[index][field] = value;
    setExam({ ...exam, questions: updated });
  };

  const deleteQuestion = (index: number) => {
    const updated = exam.questions.filter((_: any, i: number) => i !== index);
    setExam({ ...exam, questions: updated });
  };

  const addQuestion = () => {
    if (exam.questions.length >= exam.totalQuestions) return;

    setExam({
      ...exam,
      questions: [...exam.questions, { question: "", expectedAnswer: "" }],
    });
  };

  /* ================= SAVE ================= */

  const saveExam = async () => {
    await fetch(`${API}/faculty/oral/${exam._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        questions: exam.questions,
      }),
    });

    alert("Saved successfully!");
  };

  /* ================= ASSIGN ================= */

  const assignExam = async () => {
    await fetch(`${API}/faculty/oral/${exam._id}/assign`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("Assigned successfully!");
    setExam(null);
    fetchScheduled();
  };

  /* ================= DELETE SCHEDULED ================= */

  const deleteExam = async (id: string) => {
    await fetch(`${API}/faculty/oral/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchScheduled();
  };

  return (
    <div className="p-8 space-y-10">
      {/* CREATE SECTION */}
      {!exam && (
        <Card className="p-6 space-y-4">
          <Input
            placeholder="Topic"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          />

          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <Input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />

          <select
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="10">10 min</option>
            <option value="20">20 min</option>
            <option value="30">30 min</option>
            <option value="60">60 min</option>
          </select>

          <Button onClick={handleGenerate}>
            {loading ? "Generating..." : "Generate Oral"}
          </Button>
        </Card>
      )}

      {/* EDIT SECTION */}
      {exam && (
        <div className="space-y-6">
          {exam.questions.map((q: any, i: number) => (
            <Card key={i} className="p-6 space-y-4">
              <div>
                <Label>Question</Label>
                <Input
                  disabled={editingIndex !== i}
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(i, "question", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Expected Answer</Label>
                <Input
                  disabled={editingIndex !== i}
                  value={q.expectedAnswer}
                  onChange={(e) =>
                    updateQuestion(i, "expectedAnswer", e.target.value)
                  }
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setEditingIndex(editingIndex === i ? null : i)}
                >
                  {editingIndex === i ? "Done" : "Edit"}
                </Button>

                <Button variant="destructive" onClick={() => deleteQuestion(i)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}

          <Button
            onClick={addQuestion}
            disabled={exam.questions.length >= exam.totalQuestions}
          >
            Add Question
          </Button>

          <div className="flex gap-4">
            <Button onClick={saveExam}>Save Changes</Button>
            <Button onClick={assignExam}>Assign to Students</Button>
          </div>
        </div>
      )}

      {/* SCHEDULED TESTS */}
      <div className="space-y-6 border-t pt-8">
        <h2 className="text-xl font-semibold">Scheduled Tests</h2>

        {scheduledExams.length === 0 ? (
          <Card className="p-6 text-center">No tests scheduled</Card>
        ) : (
          scheduledExams.map((exam) => (
            <Card
              key={exam._id}
              className="p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{exam.topic}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(exam.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  • {exam.time} • {exam.duration} mins
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    router.push(`/faculty/oral-schedule/${exam._id}`)
                  }
                >
                  View
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => deleteExam(exam._id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
