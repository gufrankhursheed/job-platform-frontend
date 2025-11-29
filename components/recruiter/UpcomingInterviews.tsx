"use client";

import Link from "next/link";
import { apiFetch } from "@/utils/api";
import { useEffect, useState } from "react";

export default function UpcomingInterviews() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("", {
          method: "GET",
        });
        const data = await res.json();

        setInterviews(data.interviews || []);
      } catch (err) {
        console.log(err);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">
        Upcoming Interviews
      </h2>

      {interviews.length === 0 ? (
        <p className="text-gray-600">No upcoming interviews.</p>
      ) : (
        <ul className="space-y-3">
          {interviews.map((interview: any) => (
            <li
              key={interview.id}
              className="border-b last:border-b-0 pb-2 text-gray-800"
            >
              <Link
                className="hover:underline"
                href={`/recruiter/interviews/${interview.id}`}
              >
                • Interview with {interview.candidateName} —{" "}
                {interview.jobTitle} on{" "}
                {new Date(interview.date).toLocaleString()}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <button
        className="mt-5 text-indigo-600 font-semibold hover:underline cursor-pointer"
        onClick={() => (window.location.href = "/recruiter/interviews")}
      >
        View All Interviews
      </button>
    </div>
  );
}
