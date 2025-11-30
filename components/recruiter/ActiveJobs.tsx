"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ActiveJobs() {
  const [jobs, setJobs] = useState([]);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch(`job/employer/${user?.id}?limit=5`, { method: "GET" });
        const data = await res.json();

        setJobs(data.jobs || []);
      } catch (err) {
        console.log(err);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Active Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-600">No active jobs available.</p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job: any) => (
            <li key={job.id} className="border-b last:border-b-0 pb-2">
              <Link
                className="hover:underline text-gray-800"
                href={`/recruiter/jobs/${job.id}`}
              >
                • {job.title} — {job.totalApplicants} applicants
              </Link>
            </li>
          ))}
        </ul>
      )}

      <button
        className="mt-5 text-indigo-600 font-semibold hover:underline cursor-pointer"
        onClick={() => (window.location.href = "/recruiter/jobs")}
      >
        Manage Jobs
      </button>
    </div>
  );
}
