"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProtectedPage from "@/components/ProtectedPage";
import { apiFetch } from "@/utils/api";

export default function ScheduleInterviewPage() {
  const params = useSearchParams();
  const router = useRouter();

  const candidateId = params.get("candidateId");
  const jobId = params.get("jobId");
  const applicationId = params.get("applicationId");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!date || !time) {
      setErrorMsg("Please select date and time.");
      return;
    }

    const scheduledAt = new Date(`${date}T${time}:00`);

    const body = {
      candidateId,
      jobId: Number(jobId),
      applicationId: Number(applicationId),
      scheduledAt,
      durationMinutes: duration,
      notes,
    };

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await apiFetch("/interview", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to schedule interview.");
      }

      setSuccessMsg("Interview scheduled successfully!");

      setTimeout(() => {
        router.push(`/recruiter/jobs/${jobId}/applications`);
      }, 1500);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedPage allowedRoles={["recruiter"]}>
      <div className="max-w-2xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-semibold mb-6">Schedule Interview</h1>

        {/* Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border">
          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Date */}
            <div>
              <label className="block mb-1 text-sm font-medium">Date</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Time */}
            <div>
              <label className="block mb-1 text-sm font-medium">Time</label>
              <input
                type="time"
                className="w-full border rounded-md px-3 py-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Duration (minutes)
              </label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={15}
                max={120}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Notes (optional)
              </label>
              <textarea
                rows={3}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Any special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Error */}
            {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}

            {/* Success */}
            {successMsg && (
              <div className="text-green-600 text-sm">{successMsg}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Schedule Interview"}
            </button>
          </form>
        </div>
      </div>
    </ProtectedPage>
  );
}
