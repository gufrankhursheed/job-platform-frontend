"use client";

import { FiExternalLink } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ApplicantCard({ application, onStatusChange }: any) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const profile = application?.candidate?.profile;

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "Unknown Candidate";

  const email = user?.email || "Unknown Email";

  const statusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-700";
      case "shortlisted":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "hired":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 border border-gray-200 rounded-xl shadow-md bg-white transition hover:shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* LEFT */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-indigo-700">{fullName}</h2>

          <p className="text-sm text-gray-600 mt-1">{email}</p>

          <p className="text-xs text-gray-400 mt-2">
            Applied on: {new Date(application.appliedDate).toLocaleDateString()}
          </p>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium mt-2 inline-block ${statusColor(
              application.status
            )}`}
          >
            {application.status}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          {/* Resume */}
          {profile?.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              className="px-3 py-1 text-xs rounded-md border bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center gap-1"
            >
              Resume <FiExternalLink size={14} />
            </a>
          )}

          {/* View Profile */}
          <button
            onClick={() =>
              router.push(`/recruiter/candidates/${application.candidateId}`)
            }
            className="px-3 py-1 text-xs rounded-md border bg-gray-100 hover:bg-gray-200"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => onStatusChange(application.id, "shortlisted")}
          className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
        >
          Shortlist
        </button>

        <button
          onClick={() => onStatusChange(application.id, "rejected")}
          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
        >
          Reject
        </button>

        <button
          onClick={() => onStatusChange(application.id, "hired")}
          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
        >
          Hire
        </button>

        <button
          onClick={() =>
            router.push(
              `/recruiter/interviews/schedule?candidateId=${application.candidateId}&jobId=${application.jobId}&applicationId=${application.id}`
            )
          }
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
        >
          Schedule Interview
        </button>
      </div>
    </div>
  );
}
