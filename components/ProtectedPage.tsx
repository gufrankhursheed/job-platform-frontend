"use client";

import { ReactNode } from "react";
import useAuth from "../hooks/useAuth";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProctectedPage({children}: ProtectedRouteProps) {
    const user = useAuth()

    if (!user) {
      return (
        <div className="flex min-h-screen items-center justify-center text-xl">
          Checking authentication...
        </div>
      );
    }

    return <>{children}</>
}