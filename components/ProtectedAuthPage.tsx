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
  const user = useAuth();

  useEffect(() => {
    if (!user) return;

    if (user.role === "candidate") {
      router.replace("/candidate/dashboard");
    } else if (user.role === "recruiter") {
      router.replace("/recruiter/dashboard");
    } else {
      router.replace("/dashboard");
    }
  }, [user]);

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Redirecting...
      </div>
    );
  }

  return <>{children}</>;
}
