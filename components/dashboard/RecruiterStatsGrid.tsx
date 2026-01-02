"use client";

import { useRouter } from "next/navigation";
import DashboardCard from "./DashboardCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FiBriefcase, FiCalendar, FiUsers } from "react-icons/fi";

export default function RecruiterStatsGrid({applicants}: {applicants: number}) {
  const router = useRouter();

  const jobs = useSelector((state: RootState) => state.jobs.activeJobs.length);
  const interviews = useSelector((state: RootState) => state.interview.recruiterInterviewsCount);

  return (
    <div className="flex flex-col gap-6">
      <DashboardCard
        title="Active Jobs Posted"
        value={jobs}
        icon={<FiBriefcase />}
        buttonLabel="Mange Jobs"
        onClick={() => router.push("/recruiter/jobs/manage")}
      />

      <DashboardCard
        title="Upcoming Interviews"
        value={interviews}
        icon={<FiCalendar />}
        buttonLabel="View Interviews"
        onClick={() => router.push("/recruiter/interviews")}
      />

      <DashboardCard
        title="Total Applicants"
        value={applicants}
        icon={<FiUsers />}
        buttonLabel="View Applicants"
        onClick={() => router.push("/recruiter/applicants")}
      />
    </div>
  );
}
