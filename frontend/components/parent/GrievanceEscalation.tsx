"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import API from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Grievance {
  _id: string;
  student: { fullName: string; email: string; phone: string };
  assignedFaculty: { fullName: string; email: string; phone: string };
  initialGrievance: string;
  aiAnalysis?: { synthesizedMessage?: string };
  status: string;
  timeline?: { createdAt: string };
  escalation?: { escalatedAt: string };
}

export default function ParentGrievanceEscalation() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [loading, setLoading] = useState(true);

  // Note: Socket.io listener would be initialized here in production
  // For now, we'll use polling or webhooks

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const response = await API.get(
        "/grievance/parent/escalated"
      );
      setGrievances(response.data.grievances);
    } catch (err) {
      console.error("Error fetching escalated grievances:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading escalated grievances...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Escalated Grievances
      </h1>

      {grievances.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg">
            No grievances have been escalated at this time. Your child's concerns are being resolved promptly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grievances.map((grievance) => (
            <div
              key={grievance._id}
              onClick={() => setSelectedGrievance(grievance)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition border-l-4 border-red-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {grievance.student.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {grievance.student.email}
                  </p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                  ESCALATED
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Faculty:</strong> {grievance.assignedFaculty.fullName}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Grievance:</strong>
                </p>
                <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded">
                  {grievance.initialGrievance}
                </p>
              </div>

              <div className="text-xs text-gray-500">
                <p>
                  Escalated:{" "}
                  {grievance.escalation?.escalatedAt
                    ? new Date(grievance.escalation.escalatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <button
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGrievance(grievance);
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED VIEW MODAL */}
      {selectedGrievance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Escalation Details
              </h2>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* STUDENT INFORMATION */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Student Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {selectedGrievance.student.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedGrievance.student.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedGrievance.student.phone}
                  </p>
                </div>
              </div>

              {/* GRIEVANCE INFORMATION */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900 mb-3">
                  Grievance Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-red-700 font-semibold">Concern:</p>
                    <p className="text-gray-800 mt-1">
                      {selectedGrievance.initialGrievance}
                    </p>
                  </div>
                  <div>
                    <p className="text-red-700 font-semibold">
                      AI Processed Message:
                    </p>
                    <p className="text-gray-800 mt-1 italic">
                      {selectedGrievance.aiAnalysis?.synthesizedMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* ESCALATION TIMELINE */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                  Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Submitted:</strong>{" "}
                    {selectedGrievance.timeline?.createdAt
                      ? new Date(selectedGrievance.timeline.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Escalated to Parent:</strong>{" "}
                    {selectedGrievance.escalation?.escalatedAt
                      ? new Date(selectedGrievance.escalation.escalatedAt).toLocaleString()
                      : "N/A"}
                  </p>
                  <p className="text-red-600 font-semibold">
                    ⚠️ This grievance has been pending for 48+ hours
                  </p>
                </div>
              </div>

              {/* FACULTY INFORMATION */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Assigned Faculty
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedGrievance.assignedFaculty.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedGrievance.assignedFaculty.email}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedGrievance.assignedFaculty.phone}
                  </p>
                </div>
              </div>

              {/* RECOMMENDED ACTIONS */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  Recommended Actions
                </h3>
                <ul className="space-y-2 text-sm text-gray-800">
                  <li>• Contact the faculty member directly regarding the delay</li>
                  <li>• Request status update on grievance resolution</li>
                  <li>• Document all communications for records</li>
                  <li>• Contact school administration if issue persists</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedGrievance(null)}
                  className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedGrievance.assignedFaculty.email}?subject=Grievance%20Follow-up%20-%20${selectedGrievance.student.fullName}`}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-center"
                >
                  Contact Faculty
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
