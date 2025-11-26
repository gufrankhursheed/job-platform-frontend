"use client";

import { ReactNode, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedPage({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return; // still loading, pause logic

    if (!user) {
      // Not authenticated, redirect to login
      router.replace("/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      const redirectMap: Record<string, string> = {
        candidate: "/candidate/dashboard",
        recruiter: "/recruiter/dashboard",
      };

      const redirectTo = redirectMap[user.role] || "/login";
      router.replace(redirectTo);
    } else {
      setIsChecking(false);
    }
  }, [user, loading, allowedRoles, router]);

  // Still loading auth OR checking role
  if (loading || !user || isChecking) {
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

  return <>{children}</>;
}
