"use client";

import { FiBriefcase, FiCalendar, FiBookmark} from "react-icons/fi";
import DashboardCard from "./DashboardCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";


export default function CandidateStatsGrid() {
  const router = useRouter();

  const applications = useSelector((state: RootState) => state.applications.applicationsCount);
  const interviews = useSelector((state: RootState) => state.interview.candidateInterviewsCount);
  const savedJobs = useSelector((state: RootState) => state.jobs.savedJobsCount);

  return (
    <div className="flex flex-col gap-6">
      <DashboardCard
        title="Applications"
        value={applications}
        icon={<FiBriefcase />}
        buttonLabel="View All Applications"
        onClick={() => router.push("/candidate/applications")}
      />

      <DashboardCard
        title="Interviews"
        value={interviews}
        icon={<FiCalendar />}
        buttonLabel="View All Interviews"
        onClick={() => router.push("/candidate/interviews")}
      />

      <DashboardCard
        title="Saved Jobs"
        value={savedJobs}
        icon={<FiBookmark/>}
        buttonLabel="View savedJobs"
        onClick={() => router.push("/candidate/saved-jobs")}
      />
    </div>
  );
}
