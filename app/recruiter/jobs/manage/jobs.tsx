"use client";

import { useEffect, useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { apiFetch } from "@/utils/api";

import { removeJob, updateJobStatus } from "@/redux/slices/jobsSlice";
import {
  FiEdit,
  FiUsers,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
} from "react-icons/fi";

type JobApplicationsMap = {
  [jobId: number]: number;
};

const PAGE_SIZE = 10;

export default function ManageJobsPage() {
  const dispatch = useDispatch();

  // Redux store
  const activeJobs = useSelector((state: RootState) => state.jobs.activeJobs);
  const closedJobs = useSelector((state: RootState) => state.jobs.closedJobs);

  // Applications count state
  const [applicationsCountMap, setApplicationsCountMap] =
    useState<JobApplicationsMap>({});

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "closed">("active");

  // Pagination state
  const [activePage, setActivePage] = useState(1);
  const [closedPage, setClosedPage] = useState(1);

  const fetchApplicationCounts = async () => {
    try {
      const res = await apiFetch("application/recruiter/job-counts", {
        method: "GET",
      });
      const data = await res.json();

      if (Array.isArray(data?.counts)) {
        const map: JobApplicationsMap = {};
        data.counts.forEach((item: any) => (map[item.jobId] = item.count));
        setApplicationsCountMap(map);
      }
    } catch (err) {
      console.error("Failed to fetch applications count", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationCounts();
  }, []);

  // Reset page when switching tabs
  useEffect(() => {
    if (activeTab === "active") {
      setActivePage(1);
    } else {
      setClosedPage(1);
    }
  }, [activeTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage, closedPage]);

  const updateStatus = async (id: number, newStatus: "open" | "closed") => {
    try {
      await apiFetch(`job/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      dispatch(updateJobStatus({ id, status: newStatus }));
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Status update failed");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      await apiFetch(`job/${id}`, {
        method: "DELETE",
      });

      dispatch(removeJob(id));
    } catch (err) {
      console.error("Failed to delete job", err);
      alert("Failed to delete job");
    }
  };

  // Pagination logic
  const paginate = (items: any[], page: number) => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  };

  const jobsToShow = activeTab === "active" ? activeJobs : closedJobs;

  const currentPage = activeTab === "active" ? activePage : closedPage;
  const totalPages = Math.ceil(jobsToShow.length / PAGE_SIZE);

  const paginatedJobs = paginate(jobsToShow, currentPage);

  const setPage = (page: number) => {
    if (activeTab === "active") setActivePage(page);
    else setClosedPage(page);
  };

  return (
    <ProtectedPage allowedRoles={["recruiter"]}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-10">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-indigo-700">
              Manage Jobs
            </h1>

            <Link
              href="/jobs/create"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700"
            >
              + Create Job
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-300 mb-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`pb-2 font-semibold ${
                activeTab === "active"
                  ? "text-indigo-700 border-b-2 border-indigo-700"
                  : "text-gray-500"
              }`}
            >
              Active Jobs
            </button>

            <button
              onClick={() => setActiveTab("closed")}
              className={`pb-2 font-semibold ${
                activeTab === "closed"
                  ? "text-indigo-700 border-b-2 border-indigo-700"
                  : "text-gray-500"
              }`}
            >
              Closed Jobs
            </button>
          </div>

          {loading && <p className="text-gray-500">Loading...</p>}

          {!loading && paginatedJobs.length === 0 && (
            <p className="text-gray-600">
              No {activeTab === "active" ? "active" : "closed"} jobs found.
            </p>
          )}

          <div className="space-y-4">
            {paginatedJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {job.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Applications:{" "}
                      <span className="font-semibold text-indigo-700">
                        {applicationsCountMap[job.id] ?? 0}
                      </span>
                    </p>

                    <p className="text-sm text-gray-500">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          job.status === "open"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {job.status.toUpperCase()}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/jobs/${job.id}/edit`}
                      className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                    >
                      <FiEdit />
                    </Link>

                    <Link
                      href={`/jobs/${job.id}/applicants`}
                      className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                    >
                      <FiUsers />
                    </Link>

                    {job.status === "open" ? (
                      <button
                        onClick={() => updateStatus(job.id, "closed")}
                        className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                      >
                        <FiToggleLeft />
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(job.id, "open")}
                        className="px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                      >
                        <FiToggleRight />
                      </button>
                    )}

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
                    >
                      <FiTrash2 />
                      <span className="hidden md:block">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === idx + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </ProtectedPage>
  );
}
