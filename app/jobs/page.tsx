"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { FiSearch } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedPage from "@/components/ProtectedPage";

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search + Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [remote, setRemote] = useState(searchParams.get("remote") || "");

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  // Pagination
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const limit = 10;

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Build query string for API + URL sync
  function buildQuery() {
    const params = new URLSearchParams();

    params.set("page", page.toString());
    params.set("limit", limit.toString());

    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    if (remote) params.set("remote", remote);

    return params.toString();
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Fetch jobs on filter/page change
  useEffect(() => {
    async function load() {
      setLoading(true);
      const query = buildQuery();

      // Update URL in browser
      router.replace(`/jobs?${query}`);

      const res = await apiFetch(`job/?${query}`, { method: "GET" });
      const data = await res.json();

      setJobs(data.jobs || []);
      setPagination(data.pagination || null);
      setLoading(false);
    }

    load();
  }, [page, search, category, location, remote]);

  return (
    <ProtectedPage allowedRoles={["candidate"]}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-10">
          Browse Jobs
        </h1>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => router.push("/candidate/saved-jobs")}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition font-semibold"
          >
            Saved Jobs
          </button>
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-xl shadow p-4 mb-8">
          <FiSearch className="text-indigo-600 text-xl" />
          <input
            type="text"
            className="flex-1 outline-none text-gray-700 text-lg"
            placeholder="Search by job title, company..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <button
            onClick={() => {
              setSearch(searchInput);
              setPage(1);
            }}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Category */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="p-3 bg-white border border-gray-300 rounded-xl shadow text-gray-700"
          >
            <option value="">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>

          {/* Location */}
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPage(1);
            }}
            placeholder="Location"
            className="p-3 bg-white border border-gray-300 rounded-xl shadow text-gray-700"
          />

          {/* Remote */}
          <select
            value={remote}
            onChange={(e) => {
              setRemote(e.target.value);
              setPage(1);
            }}
            className="p-3 bg-white border border-gray-300 rounded-xl shadow text-gray-700"
          >
            <option value="">Remote & Onsite</option>
            <option value="true">Remote Only</option>
            <option value="false">Onsite Only</option>
          </select>
        </div>

        {/* JOB LIST */}
        {loading ? (
          <p className="text-gray-600 text-lg">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600 text-lg">No jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job: any) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-gray-200 shadow-md p-6"
              >
                <h2 className="text-xl font-bold text-indigo-700">
                  {job.title}
                </h2>

                <p className="text-gray-600 mt-1">{job.companyName}</p>

                <p className="text-sm text-gray-500 mt-2">
                  {job.location} • {job.remote ? "Remote" : "Onsite"}
                </p>

                <button
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {pagination && (
          <div className="flex justify-center mt-10 gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </ProtectedPage>
  );
}
