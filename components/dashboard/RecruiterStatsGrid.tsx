"use client";

import { useRouter } from "next/navigation";
import DashboardCard from "./DashboardCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FiBriefcase, FiCalendar, FiUsers } from "react-icons/fi";

export default function RecruiterStatsGrid() {
  const router = useRouter();

  const jobs = useSelector((state: RootState) => state.jobs.totalJobsPosted);
  const applicants = useSelector((state: RootState) => state.applications.totalApplicants);
  const interviews = useSelector((state: RootState) => state.interview.recruiterInterviewsCount);

  return (
    <div className="flex flex-col gap-6">
      <DashboardCard
        title="Jobs Posted"
        value={jobs}
        icon={<FiBriefcase />}
        buttonLabel="Mange Jobs"
        onClick={() => router.push("/recruiter/jobs")}
      />

      <DashboardCard
        title="Total Applicants"
        value={applicants}
        icon={<FiUsers />}
        buttonLabel="View Applicants"
        onClick={() => router.push("/recruiter/applicants")}
      />

      <DashboardCard
        title="Upcoming Interviews"
        value={interviews}
        icon={<FiCalendar />}
        buttonLabel="View Interviews"
        onClick={() => router.push("/recruiter/interviews")}
      />
    </div>
  );
}
