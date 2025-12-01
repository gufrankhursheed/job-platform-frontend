"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addAppliedJob } from "@/redux/slices/applicationsSlice";
import { addSavedJob, removeSavedJob } from "@/redux/slices/jobsSlice";

import { FiSave, FiCheck, FiSend } from "react-icons/fi";
import ProtectedPage from "@/components/ProtectedPage";

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const appliedJobs = useSelector(
    (state: RootState) => state.applications.appliedJobs
  );
  const savedJobs = useSelector((state: RootState) => state.jobs.savedJobs);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  const isApplied = appliedJobs.includes(jobId as string);
  const isSaved = savedJobs.includes(jobId as string);

  // Fetch job details
  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        const res = await apiFetch(`job/${jobId}`, { method: "GET" });
        const data = await res.json();
        setJob(data.job);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [jobId]);

  // APPLY FUNCTION
  const handleApply = async () => {
    if (isApplied || applying) return;

    try {
      setApplying(true);

      const res = await apiFetch(`application/apply`, {
        method: "POST",
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message || "Apply failed");
        return;
      }

      dispatch(addAppliedJob(jobId as string));
    } catch (err) {
      console.log(err);
    } finally {
      setApplying(false);
    }
  };

  // SAVE / UNSAVE JOB
  const handleSave = async () => {
    try {
      setSaving(true);

      const endpoint = isSaved ? "job/unsave" : "job/save";

      const res = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message || "Save failed");
        return;
      }

      if (isSaved) {
        dispatch(removeSavedJob(jobId as string));
      } else {
        dispatch(addSavedJob(jobId as string));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading job details...
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen flex items-center justify-center text-lg text-red-600">
        Job not found.
      </main>
    );
  }

  return (
    <ProtectedPage allowedRoles={["candidate"]}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-8">
          {/* Job Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-indigo-700">
                {job.title}
              </h1>

              <p className="text-gray-600 mt-1">{job.companyName}</p>
              <p className="text-sm text-gray-500 mt-1">
                {job.location} • {job.remote ? "Remote" : "Onsite"}
              </p>

              {job.salaryRange && (
                <p className="text-gray-500 mt-1">Salary: {job.salaryRange}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {/* APPLY */}
              <button
                onClick={handleApply}
                disabled={isApplied || applying}
                className={`px-5 py-2 rounded-lg font-semibold shadow text-white transition flex items-center gap-2 ${
                  isApplied
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isApplied ? <FiCheck /> : <FiSend />}
                {isApplied ? "Applied" : applying ? "Applying..." : "Apply Now"}
              </button>

              {/* SAVE */}
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded-lg font-semibold shadow flex items-center gap-2 transition ${
                  isSaved
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                <FiSave />
                {saving ? "Saving..." : isSaved ? "Saved" : "Save Job"}
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <section className="mt-6">
            <h2 className="text-xl font-bold text-indigo-600 mb-2">
              Job Description
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {job.description}
            </p>
          </section>

          {/* REQUIREMENTS */}
          {job.requirements?.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xl font-bold text-indigo-600 mb-2">
                Requirements
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {job.requirements.map((req: string, idx: number) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {/* RESPONSIBILITIES */}
          {job.responsibilities?.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xl font-bold text-indigo-600 mb-2">
                Responsibilities
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {job.responsibilities.map((res: string, idx: number) => (
                  <li key={idx}>{res}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </ProtectedPage>
  );
}
