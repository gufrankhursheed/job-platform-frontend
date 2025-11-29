"use client";

import { apiFetch } from "@/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RecentApplicants() {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("", {
          method: "GET",
        });
        const data = await res.json();

        setApplicants(data);
      } catch (error) {
        console.log(error);
      }
    }

    load();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">
        Recent Applicants
      </h2>

      {applicants.length === 0 ? (
        <p className="text-gray-600">No recent applicants found.</p>
      ) : (
        <ul className="space-y-3">
          {applicants.map((applicant: any) => (
            <li
              key={applicant.id}
              className="border-b last:border-b-0 pb-2 text-gray-800"
            >
              <Link
                className="hover:underline"
                href={`/recruiter/applicants/${applicant.id}`}
              >
                • {applicant.name} — Applied for {applicant.jobTitle}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <button
        className="mt-5 text-indigo-600 font-semibold hover:underline cursor-pointer"
        onClick={() => (window.location.href = "/recruiter/applicants")}
      >
        View All Applicants
      </button>
    </div>
  );
}
