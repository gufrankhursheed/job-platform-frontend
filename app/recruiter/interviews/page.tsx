"use client";

import { useEffect, useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import { apiFetch } from "@/utils/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiArrowRight, FiExternalLink } from "react-icons/fi";

type Interview = {
  id: number;
  candidateId: string;
  recruiterId: string;
  jobId: number;
  applicationId: number;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  meetingLink?: string;
  notes?: string;
  job: {
    title: string;
    companyName: string;
    location: string;
  } | null;
  candidate: {
    profile: {
      firstName: string;
      lastName: string;
      resumeUrl?: string;
      location?: string;
    };
  } | null;
};

export default function RecruiterInterviewsPage() {
  const router = useRouter();
  const recruiterId = useSelector((state: RootState) => state.auth.user?.id);

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(
        `/interview/recruiter/${recruiterId}?page=${page}&limit=6`,
        { method: "GET" }
      );

      const data = await res.json();

      setInterviews(data.interviews || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch interviews", error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recruiterId) fetchInterviews();
  }, [page, recruiterId]);

  const statusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const updateInterviewStatus = async (
    interviewId: number,
    status: "completed" | "cancelled"
  ) => {
    try {
      await apiFetch(`/interview/${interviewId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      // Optimistic UI update
      setInterviews((prev) =>
        prev.map((i) => (i.id === interviewId ? { ...i, status } : i))
      );
    } catch (err) {
      alert("Failed to update interview status");
    }
  };

  const handleReschedule = (interview: Interview) => {
    router.push(
      `/recruiter/interviews/schedule?candidateId=${interview.candidateId}&jobId=${interview.jobId}&applicationId=${interview.applicationId}`
    );
  };

  return (
    <ProtectedPage allowedRoles={["recruiter"]}>
      <div className="max-w-5xl mx-auto mt-8 p-4">
        <h1 className="text-2xl font-semibold mb-6">My Interviews</h1>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-10">Loading interviews...</div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No interviews scheduled yet.
          </div>
        ) : (
          <div className="space-y-5">
            {interviews.map((i) => {
              const profile = i.candidate?.profile;
              const fullName = profile
                ? `${profile.firstName} ${profile.lastName}`
                : "Unknown Candidate";

              return (
                <div
                  key={i.id}
                  className="p-5 border rounded-xl shadow-sm bg-white"
                >
                  {/* HEADER */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    {/* LEFT */}
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-indigo-700">
                        {fullName}
                      </h2>

                      <p className="text-sm text-gray-600">
                        {i.job?.title} @ {i.job?.companyName}
                      </p>

                      {i.job?.location && (
                        <p className="text-sm text-gray-500">
                          {i.job.location}
                        </p>
                      )}

                      <div className="mt-2 text-sm">
                        <span className="font-medium">Interview:</span>{" "}
                        {new Date(i.scheduledAt).toLocaleString()}
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">Duration:</span>{" "}
                        {i.durationMinutes} mins
                      </div>

                      {i.notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {i.notes}
                        </p>
                      )}
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-end gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                          i.status
                        )}`}
                      >
                        {i.status}
                      </span>

                      {/* Meeting */}
                      {i.meetingLink && (
                        <a
                          href={i.meetingLink}
                          target="_blank"
                          className="text-blue-600 text-sm flex items-center gap-1 underline"
                        >
                          Join Meeting <FiExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {/* Resume */}
                    {profile?.resumeUrl && (
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        className="px-3 py-1 text-xs rounded-md border bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center gap-1"
                      >
                        Resume <FiExternalLink size={14} />
                      </a>
                    )}

                    {/* View Profile */}
                    <button
                      onClick={() =>
                        router.push(`/recruiter/candidates/${i.candidateId}`)
                      }
                      className="px-3 py-1 text-xs rounded-md border bg-gray-100 hover:bg-gray-200"
                    >
                      View Profile
                    </button>

                    {/* === INTERVIEW ACTIONS (ONLY IF SCHEDULED) === */}
                    {i.status === "scheduled" && (
                      <>
                        {/* Mark Completed */}
                        <button
                          onClick={() =>
                            updateInterviewStatus(i.id, "completed")
                          }
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Mark Completed
                        </button>

                        {/* Cancel */}
                        <button
                          onClick={() =>
                            updateInterviewStatus(i.id, "cancelled")
                          }
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Cancel
                        </button>

                        {/* Reschedule */}
                        <button
                          onClick={() => handleReschedule(i)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Reschedule
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-2 border rounded disabled:opacity-40"
            >
              <FiArrowLeft />
            </button>

            <span className="text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-2 border rounded disabled:opacity-40"
            >
              <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}
