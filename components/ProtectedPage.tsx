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
  const user = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user) return; // still loading

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      const redirectMap: Record<string, string> = {
        candidate: "/candidate/dashboard",
        recruiter: "/recruiter/dashboard"
      };

      const redirectTo = redirectMap[user.role] || "/login";
      router.replace(redirectTo);
    } else {
      setIsChecking(false);
    }
  }, [user, allowedRoles, router]);

  // Still loading auth OR checking role
  if (!user || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}
