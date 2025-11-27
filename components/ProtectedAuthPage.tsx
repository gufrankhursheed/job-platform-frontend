"use client";

import { ReactNode, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ProtectedAuthPage({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user) return;

    if (user.role === "candidate") {
      router.replace("/candidate/dashboard");
    } else if (user.role === "recruiter") {
      router.replace("/recruiter/dashboard");
    }
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 p-6">
        <section className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-xl font-semibold text-indigo-600">
            Checking authentication...
          </h1>
        </section>
      </main>
    );
  }

  if (!user && !loading) {
    return <>{children}</>;
  }

  return null;
}
