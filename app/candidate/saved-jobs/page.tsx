"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { useRouter } from "next/navigation";
import { BsBookmark, BsBriefcase } from "react-icons/bs";
import { FiMapPin, FiTrash2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { removeSavedJob } from "@/redux/slices/jobsSlice";
import ProtectedPage from "@/components/ProtectedPage";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 10;

  const router = useRouter();
  const dispatch = useDispatch();

  async function loadPage() {
    setLoading(true);

    const res = await apiFetch(`saved-jobs?page=${page}&limit=${limit}`, {
      method: "GET",
    });

    const data = await res.json();

    setSavedJobs(data.savedJobs || []);
    setPagination(data.pagination || null);

    setLoading(false);
  }

  useEffect(() => {
    loadPage();
  }, [page]);

  // REMOVE JOB HANDLER
  async function handleRemove(jobId: string) {
    try {
      // Optimistic update for instant UI feedback
      setSavedJobs((prev) => prev.filter((job: any) => job.id !== jobId));
      dispatch(removeSavedJob(jobId));

      await apiFetch(`saved-jobs/${jobId}`, {
        method: "DELETE",
      });

      // If it was the last item on the page, reload
      if (savedJobs.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadPage();
      }
    } catch (err) {
      console.log("Failed to remove saved job:", err);
    }
  }

  return (
    <ProtectedPage allowedRoles={["candidate"]}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-10">
          Saved Jobs
        </h1>

        {loading && (
          <p className="text-gray-600 text-lg animate-pulse">
            Loading saved jobs...
          </p>
        )}

        {!loading && savedJobs.length === 0 && (
          <p className="text-gray-600 text-lg bg-white p-6 rounded-xl shadow text-center">
            You haven't saved any jobs yet.
          </p>
        )}

        {!loading && savedJobs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job: any) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-gray-200 shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-indigo-700">
                    {job.title}
                  </h2>
                  <BsBookmark className="text-indigo-600 text-2xl" />
                </div>

                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <BsBriefcase className="text-gray-500" /> {job.companyName}
                </p>

                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  <FiMapPin /> {job.location} •{" "}
                  {job.remote ? "Remote" : "Onsite"}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => router.push(`/jobs/${job.id}`)}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleRemove(job.id)}
                    className="w-12 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    title="Remove from saved"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && savedJobs.length > 0 && (
          <div className="flex justify-center mt-10 gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-5 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow text-sm">
              {page} / {pagination.totalPages}
            </span>

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-5 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </ProtectedPage>
  );
}
