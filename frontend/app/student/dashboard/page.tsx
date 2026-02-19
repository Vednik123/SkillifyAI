"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Target,
  Flame,
  TrendingUp,
  MessageSquare,
  Mic,
  Brain,
  ClipboardList,
} from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const COLORS = ["#7C3AED", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/student/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("DASHBOARD DATA:", data); // 🔥 DEBUG
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, router]);

  if (loading || !dashboardData) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  const performanceDistribution = [
    { name: "Quiz", value: dashboardData.avgQuizScore || 0 },
    { name: "Interview", value: dashboardData.avgInterviewScore || 0 },
    { name: "Oral", value: dashboardData.avgOralScore || 0 },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Complete AI Performance Analytics
        </p>
      </div>

      {/* KPI SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-6 flex items-center gap-4">
          <Brain className="text-purple-600" />
          <div>
            <p className="text-sm text-muted-foreground">Overall Avg</p>
            <p className="text-2xl font-bold">
              {dashboardData.overallAverage || 0}%
            </p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <ClipboardList className="text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Exam Attempts</p>
            <p className="text-2xl font-bold">
              {dashboardData.totalQuizzes || 0}
            </p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <MessageSquare className="text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Interviews</p>
            <p className="text-2xl font-bold">
              {dashboardData.totalInterviews || 0}
            </p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <Mic className="text-yellow-600" />
          <div>
            <p className="text-sm text-muted-foreground">Faculty Orals</p>
            <p className="text-2xl font-bold">
              {dashboardData.totalOrals || 0}
            </p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <TrendingUp className="text-indigo-600" />
          <div>
            <p className="text-sm text-muted-foreground">Pass Rate</p>
            <p className="text-2xl font-bold">{dashboardData.passRate || 0}%</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <Flame className="text-red-600" />
          <div>
            <p className="text-sm text-muted-foreground">Streak</p>
            <p className="text-2xl font-bold">
              {dashboardData.streak || 0} days
            </p>
          </div>
        </Card>
      </div>

      {/* TREND CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Exam Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboardData.quizTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attempt" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#7C3AED"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">Interview Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboardData.interviewTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attempt" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#06B6D4"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">Oral Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboardData.oralTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attempt" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* DISTRIBUTION + SUBJECT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Average Score Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#7C3AED" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">Subject Performance</h2>

          {dashboardData.subjectPerformance?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.subjectPerformance}
                  dataKey="score"
                  nameKey="subject"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  label
                >
                  {dashboardData.subjectPerformance.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-10">
              No subject data available
            </p>
          )}
        </Card>
      </div>

      {/* RECENT ACTIVITY */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>

        {(dashboardData.recentActivity || []).length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            No recent activity
          </p>
        ) : (
          <div className="space-y-4">
            {dashboardData.recentActivity
              .slice(0, 6)
              .map((item: any, index: number) => (
                <div key={index} className="flex justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">
                      {item.type} • {item.subject}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.title}
                    </p>
                  </div>

                  <span className="font-semibold">{item.score || 0}%</span>
                </div>
              ))}
          </div>
        )}
      </Card>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button onClick={() => router.push("/student/quiz")}>
          Practice Exams
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/student/interview")}
        >
          Practice Interviews
        </Button>
        <Button variant="outline" onClick={() => router.push("/student/oral")}>
          Faculty Orals
        </Button>
      </div>
    </div>
  );
}
