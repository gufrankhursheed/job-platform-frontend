"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedPage from "@/components/ProtectedPage";
import { apiFetch } from "@/utils/api";
import { FiExternalLink } from "react-icons/fi";

export default function CandidateProfilePage() {
  const { candidateId }: any = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/profile/${candidateId}`, { method: "GET" });
      const data = await res.json();

      setProfile(data.profile || null);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching profile:", err);
      setProfile(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [candidateId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-xl text-gray-600 bg-gradient-to-br from-blue-50 to-indigo-100">
        Loading candidate profile...
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center text-xl text-red-600 bg-gradient-to-br from-blue-50 to-indigo-100">
        Candidate profile not found.
      </main>
    );
  }

  return (
    <ProtectedPage allowedRoles={["recruiter"]}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8">
          {/* Name & Location */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
            <h1 className="text-3xl font-extrabold text-indigo-700">
              {profile.firstName} {profile.lastName}
            </h1>
            {profile.location && (
              <p className="text-gray-500 text-sm sm:text-base">
                {profile.location}
              </p>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">
                Bio
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
            </section>
          )}

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Resume */}
          {profile.resumeUrl && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">
                Resume
              </h2>
              <a
                href={profile.resumeUrl}
                target="_blank"
                className="px-4 py-2 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 inline-flex items-center gap-2 text-sm sm:text-base"
              >
                View Resume <FiExternalLink size={16} />
              </a>
            </section>
          )}

          {/* Resume Score */}
          {profile.resumeScore !== undefined && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">
                Resume Score
              </h2>
              <p className="text-gray-700">{profile.resumeScore}</p>
            </section>
          )}
        </div>
      </main>
    </ProtectedPage>
  );
}
