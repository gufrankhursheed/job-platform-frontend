"use client";

import { FiBriefcase, FiCalendar, FiBookmark} from "react-icons/fi";
import DashboardCard from "./DashboardCard";

interface StatsGridProps {
  applications: number;
  interviews: number;
  savedJobs: number;

  onViewApplications: () => void;
  onViewInterviews: () => void;
  onViewSavedJobs: () => void;
}

export default function StatsGrid({
  applications,
  interviews,
  savedJobs,
  onViewApplications,
  onViewInterviews,
  onViewSavedJobs,
}: StatsGridProps) {
  return (
    <div className="flex flex-col gap-6">
      <DashboardCard
        title="Applications"
        value={applications}
        icon={<FiBriefcase />}
        buttonLabel="View All Applications"
        onClick={onViewApplications}
      />

      <DashboardCard
        title="Interviews"
        value={interviews}
        icon={<FiCalendar />}
        buttonLabel="View All Interviews"
        onClick={onViewInterviews}
      />

      <DashboardCard
        title="Saved Jobs"
        value={savedJobs}
        icon={<FiBookmark/>}
        buttonLabel="View savedJobs"
        onClick={onViewSavedJobs}
      />
    </div>
  );
}
