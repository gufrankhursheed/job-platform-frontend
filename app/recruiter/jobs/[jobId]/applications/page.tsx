"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedPage from "@/components/ProtectedPage";
import { apiFetch } from "@/utils/api";
import ApplicantCard from "@/components/recruiter/ApplicantCard";

export default function JobApplicantsPage() {
  const { jobId }: any = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/application/job/${jobId}`, {
        method: "GET",
      });
      const data = await res.json();

      setApplications(data.applications || []);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching applicants:", err);
      setApplications([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const updateStatus = async (appId: number, status: string) => {
    await apiFetch(`/application/${appId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    fetchApplicants();
  };

  return (
    <ProtectedPage allowedRoles={["recruiter"]}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-8">
            Applicants for Job #{jobId}
          </h1>

          {loading ? (
            <div className="text-center py-10 text-xl text-gray-600">
              Loading applicants…
            </div>
          ) : applications.length === 0 ? (
            <p className="text-center py-10 text-gray-500 text-lg">
              No applicants yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {applications.map((app: any) => (
                <ApplicantCard
                  key={app.id}
                  application={app}
                  onStatusChange={updateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedPage>
  );
}
