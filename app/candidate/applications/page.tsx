"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import ProtectedPage from "@/components/ProtectedPage";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

type Application = {
  id: number;
  status: string;
  appliedAt: string;
  createdAt: string;
  job: {
    id: number;
    title: string;
    companyName: string;
    location: string;
  } | null;
};

const FILTERS = ["all", "applied", "shortlisted", "rejected", "hired"];

export default function CandidateApplicationsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filtered, setFiltered] = useState<Application[]>([]);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalItems: 0,
  });

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await apiFetch(
        `/application/candidate/${user?.id}?page=${page}&limit=6`,
        { method: "GET" }
      );
      const data = await res.json();

      setApplications(data.applications);
      setPagination(data.pagination);
      setLoading(false);
    } catch (error) {
      setApplications([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page]);

  // FILTER LOGIC
  useEffect(() => {
    if (filter === "all") {
      setFiltered(applications);
    } else {
      setFiltered(applications.filter((a) => a.status === filter));
    }
  }, [filter, applications]);

  const statusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-700";
      case "shortlisted":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "hired":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <ProtectedPage allowedRoles={["candidate"]}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-8">
            My Applications
          </h1>

          {/* FILTERS */}
          <div className="flex gap-3 mb-6 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm capitalize border transition ${
                  filter === f
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-10 text-xl text-gray-600">
              Loading applications…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-lg">
              No applications found.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((app) => (
                <div
                  key={app.id}
                  className="p-6 border border-gray-200 rounded-xl shadow-md bg-white transition hover:shadow-lg"
                >
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-indigo-700">
                        {app.job?.title ?? "Job Removed"}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {app.job?.companyName ?? "Unknown Company"}
                      </p>
                      {app.job?.location && (
                        <p className="text-sm text-gray-500">
                          {app.job.location}
                        </p>
                      )}

                      <p className="text-xs mt-2 text-gray-400">
                        Applied on:{" "}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>

                      {/* VIEW JOB BUTTON */}
                      {app.job && (
                        <button
                          onClick={() =>
                            router.push(`/candidate/jobs/${app.job?.id}`)
                          }
                          className="px-3 py-1 text-xs rounded-md border bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        >
                          View Job
                        </button>
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

              <span className="text-gray-700">
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
      </main>
    </ProtectedPage>
  );
}
