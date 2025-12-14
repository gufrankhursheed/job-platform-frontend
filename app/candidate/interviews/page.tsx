"use client";

import { useEffect, useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import { apiFetch } from "@/utils/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

type Interview = {
  id: number;
  jobId: number;
  candidateId: number;
  recruiterId: number;
  date: string;
  time: string;
  duration: number;
  mode: string;
  meetingLink?: string;
  status: "scheduled" | "completed" | "cancelled";
  job: {
    title: string;
    companyName: string;
    location: string;
  } | null;
  recruiter: {
    name: string;
    email: string;
  } | null;
};

const TABS = ["scheduled", "completed", "cancelled"];

export default function CandidateInterviewsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filtered, setFiltered] = useState<Interview[]>([]);
  const [activeTab, setActiveTab] = useState("scheduled");

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalItems: 0,
  });

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(
        `/interview/candidate/${user?.id}?status=${activeTab}&page=${page}&limit=6`,
        { method: "GET" }
      );
      const data = await res.json();

      setInterviews(data.interviews);
      setPagination(data.pagination);
      setLoading(false);
    } catch (err) {
      setInterviews([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [page, activeTab]);

  // FILTERING
  useEffect(() => {
    setFiltered(interviews);
  }, [interviews]);

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

  return (
    <ProtectedPage allowedRoles={["candidate"]}>
      <div className="max-w-4xl mx-auto mt-8 p-4">
        {/* PAGE TITLE */}
        <h1 className="text-2xl font-semibold mb-6">My Interviews</h1>

        {/* TABS */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm capitalize border transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No {activeTab} interviews found.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((i) => (
              <div
                key={i.id}
                className="p-4 border rounded-xl shadow-sm bg-white"
              >
                <div className="flex justify-between">
                  {/* LEFT SECTION */}
                  <div>
                    <h2 className="text-lg font-semibold">
                      {i.job?.title ?? "Job Removed"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {i.job?.companyName ?? "Unknown Company"}
                    </p>

                    {i.job?.location && (
                      <p className="text-sm text-gray-500">{i.job.location}</p>
                    )}

                    <p className="mt-2 text-sm">
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(i.date).toLocaleDateString()}
                    </p>

                    <p className="text-sm">
                      <span className="font-medium">Time:</span> {i.time}
                    </p>

                    {i.recruiter && (
                      <p className="text-sm mt-1 text-gray-600">
                        Recruiter: {i.recruiter.name} ({i.recruiter.email})
                      </p>
                    )}

                    {/* VIEW JOB BUTTON */}
                    {i.job && (
                      <button
                        onClick={() =>
                          router.push(`/candidate/jobs/${i.jobId}`)
                        }
                        className="mt-3 px-3 py-1 text-xs rounded-md border bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        View Job Details →
                      </button>
                    )}
                  </div>

                  {/* RIGHT SECTION */}
                  <div className="flex flex-col items-end justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                        i.status
                      )}`}
                    >
                      {i.status}
                    </span>

                    {/* MEETING LINK */}
                    {i.meetingLink && (
                      <a
                        href={i.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm underline"
                      >
                        Join Meeting →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

            <span>
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
