"use client";

import ProtectedPage from "@/components/ProtectedPage";

import RecentApplicants from "@/components/recruiter/RecentApplicants";
import UpcomingInterviews from "@/components/recruiter/UpcomingInterviews";
import ActiveJobs from "@/components/recruiter/ActiveJobs";
import RecruiterStatsGrid from "@/components/dashboard/RecruiterStatsGrid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiFetch } from "@/utils/api";
import { RootState } from "@/redux/store";
import { setRecruiterJobs } from "@/redux/slices/jobsSlice";
import { setRecruiterInterviewsCount } from "@/redux/slices/interviewSlice";

export default function RecruiterDashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [applicantsCount, setApplicantsCount] = useState<number>()

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const jobResponse = await apiFetch(`job/employer/${user?.id}`, { method: "GET" });
        const jobsData = await jobResponse.json();

        const appResposne = await apiFetch(`application/recruiter/total-applicants`, { method: "GET" });
        const applicantsData = await appResposne.json();
        setApplicantsCount(applicantsData?.count || 0);

        const interviewResponse = await apiFetch(`interview/recruiter/upcoming/count`, { method: "GET" });
        const interviewData = await interviewResponse.json();
        const interviewCount = interviewData?.count || 0;

        dispatch(setRecruiterJobs(jobsData.jobs));
        dispatch(setRecruiterInterviewsCount(interviewCount));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

    }

    load()
  }, [])

  if (loading) {
    return (
      <ProtectedPage allowedRoles={["recruiter"]}>
        <main className="min-h-screen flex items-center justify-center text-xl text-gray-600">
          Loading dashboard…
        </main>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage allowedRoles={["recruiter"]}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        {/* PAGE TITLE */}
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-10">
          Dashboard
        </h1>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <RecentApplicants />
            <UpcomingInterviews />
            <ActiveJobs />
          </div>

          {/* RIGHT SECTION */}
          <div>
            <RecruiterStatsGrid 
             applicants={applicantsCount ? applicantsCount : 0} 
            />
          </div>
        </div>
      </main>
    </ProtectedPage>
  );
}
