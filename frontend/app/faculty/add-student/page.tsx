"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import API from "@/lib/api";

export default function AddStudentPage() {
  const [studentId, setStudentId] = useState("");
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleExtract = async () => {
    try {
      setLoading(true);
      setMessage("");
      const res = await API.get(`/faculty/student/${studentId}`);
      setStudentData(res.data);
    } catch (err: any) {
      setMessage("Student not found");
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    try {
      setLoading(true);
      await API.post(`/faculty/add-student`, { studentId });
      setMessage("Student successfully added to faculty");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error adding student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="max-w-3xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold">Add Student</h1>

        <Card className="p-8 space-y-6 border shadow-lg">

          <div className="space-y-2">
            <Label>Student ID</Label>
            <Input
              placeholder="STU-551976"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleExtract}
              disabled={loading || !studentId}
              className="bg-primary hover:bg-primary/90"
            >
              Extract Data
            </Button>

            <Button
              onClick={handleAddStudent}
              disabled={loading || !studentId}
              variant="outline"
            >
              Add Student
            </Button>
          </div>

          {message && (
            <p className="text-sm text-primary">{message}</p>
          )}

          {studentData && (
            <div className="border rounded-lg p-4 bg-secondary/40">
              <p><strong>Name:</strong> {studentData.fullName}</p>
              <p><strong>Email:</strong> {studentData.email}</p>
              <p><strong>Phone:</strong> {studentData.phone}</p>
              <p><strong>Education:</strong> {studentData.educationLevel}</p>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}
