"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatsGrid from "@/components/dashboard/CandidateStatsGrid";
import ProtectedPage from "@/components/ProtectedPage";
import { apiFetch } from "@/utils/api";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setAppliedJobs } from "@/redux/slices/applicationsSlice";
import { setSavedJobs } from "@/redux/slices/jobsSlice";
import { RootState } from "@/redux/store";

export default function CandidateDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    savedJobs: 0,        
  });

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const app = await apiFetch(`application/candidate/${user?.id}`, { method: "GET" });
        const applications = await app.json();
        const appliedJobIds = applications.jobs?.map((job: any) => job.id) || [];
        const applicationCount = applications.pagination?.totalItems || 0;

        const int = await apiFetch(`interview/candidate/${user?.id}`, { method: "GET" });
        const interviews = await int.json();
        const interviewCount = interviews.pagination?.totalItems || 0;

        const saved = await apiFetch("job/saved", { method: "GET" }); 
        const savedJobs = await saved.json();
        const savedJobIds = savedJobs.savedJobs?.map((job: any) => job.id) || [];
        const savedJobsCount = savedJobs.pagination?.totalItems || 0;

        const jobsList = await apiFetch("jobs?limit=5", { method: "GET" });
        const jobs = await jobsList.json();

        setStats({
          applications: applicationCount || 0,
          interviews: interviewCount || 0,
          savedJobs: savedJobsCount || 0,
        });

        setJobs(jobs.jobs || []);

        dispatch(setAppliedJobs(appliedJobIds));
        dispatch(setSavedJobs(savedJobIds));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <ProtectedPage allowedRoles={["candidate"]}>
        <main className="min-h-screen flex items-center justify-center text-xl text-gray-600">
          Loading dashboard…
        </main>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage allowedRoles={["candidate"]}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-10">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Recent Jobs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-indigo-600 mb-4">
                Recent Jobs
              </h2>

              {jobs.length === 0 ? (
                <p className="text-gray-600">No jobs found.</p>
              ) : (
                <ul className="space-y-3">
                  {jobs.map((job: any) => (
                    <li
                      key={job.id}
                      className="border-b last:border-b-0 pb-2 text-gray-800 font-medium"
                    >
                      <Link
                        className="hover:underline"
                        href={`/jobs/${job.id}`}
                      >
                        • {job.title} — {job.company}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <button
                className="mt-5 text-indigo-600 font-semibold hover:underline cursor-pointer"
                onClick={() => router.push("/jobs")}
              >
                View All Jobs
              </button>
            </div>
          </div>

          {/* RIGHT — Stats Grid */}
          <div>
            <StatsGrid
             applications= {stats.applications}
             interviews =  {stats.interviews}
             savedJobs= {stats.savedJobs}
            />
          </div>
        </div>
      </main>
    </ProtectedPage>
  );
}
