"use client";

import { ReactNode, useEffect } from "react";
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

  useEffect(() => {
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to the user's proper dashboard based on role
      if (user.role) {
        router.replace(`/${user.role}/dashboard`);
      } else {
        router.replace("/login");
      }
    }
  }, [user, allowedRoles, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}
