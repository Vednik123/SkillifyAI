"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FacultyPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    const res = await API.get("/parent/faculty");
    setData(res.data);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Faculty of Student</h1>

      {data.map((student, index) => (
        <div key={index} className="space-y-4">
          <h2 className="text-lg font-semibold text-purple-600">
            {student.studentName}
          </h2>

          {student.faculties.map((faculty: any) => (
            <Card key={faculty._id} className="border rounded-xl shadow-sm">
              <CardContent className="p-4 space-y-4">

                {/* Faculty Info */}
                <div>
                  <p className="font-semibold text-lg">
                    {faculty.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {faculty.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    📞 {faculty.phone}
                  </p>
                </div>

                <div className="border-t pt-4 space-y-3 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Faculty ID:</span>{" "}
                    {faculty.facultyId}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-3">

                    <Button
  onClick={() => {
    const message = `Hello ${faculty.fullName}, 
I am the parent of ${student.studentName}. 
I would like to discuss my child's academic progress.

Thank you.`;

    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/${faculty.phone}?text=${encodedMessage}`,
      "_blank"
    );
  }}
  className="bg-purple-600 hover:bg-purple-700 text-white"
>
  WhatsApp
</Button>


                    <Button
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50"
                      onClick={() =>
                        window.open(
                          `mailto:${faculty.email}`,
                          "_blank"
                        )
                      }
                    >
                      Email
                    </Button>

                    <Button
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50"
                      onClick={() =>
                        window.open(`tel:${faculty.phone}`)
                      }
                    >
                      Call
                    </Button>

                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
