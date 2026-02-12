"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import API from "@/lib/api";

export default function ParentAddChildPage() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [message, setMessage] = useState("");

  const handleExtract = async () => {
  try {
    setMessage("");
    const res = await API.get(`/parent/student/${studentId}`);
    setStudent(res.data);
  } catch {
    setStudent(null);
    setMessage("Student not found");
  }
};


  const handleAdd = async () => {
    try {
      await API.post(`/parent/add-student`, { studentId });
      setMessage("Child added successfully");
    } catch (err: any) {
      setMessage(err.response?.data?.message);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Add Child</h1>

      <Card className="p-6 space-y-6 shadow-md border">
        <div className="space-y-2">
          <Label>Student ID</Label>
          <Input
            placeholder="STU-551976"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleExtract}
            className="bg-primary hover:bg-primary/90"
          >
            Extract Data
          </Button>

          <Button onClick={handleAdd} variant="outline">
            Add Child
          </Button>
        </div>

        {message && (
          <p className="text-sm font-medium text-primary">{message}</p>
        )}

        {student && (
          <div className="bg-secondary/40 p-4 rounded-lg border">
            <p><strong>Name:</strong> {student.fullName}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
            <p><strong>Education:</strong> {student.educationLevel}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
