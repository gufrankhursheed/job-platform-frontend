"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSuccess } from "@/redux/slices/authSlice";

export default function AuthSuccessPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1️⃣ Extract token & user from query string
    const token = searchParams.get("token");
    const userString = searchParams.get("user");

    if (!token || !userString) {
      console.error("Missing token or user data in URL");
      router.replace("/login");
      return;
    }

    try {
      // 2️⃣ Decode the user JSON
      const user = JSON.parse(decodeURIComponent(userString));

      // 3️⃣ Dispatch Redux loginSuccess
      dispatch(loginSuccess({ user, token }));

      // 4️⃣ Redirect based on role
      if (user.role === "candidate") {
        router.replace("/candidate/dashboard");
      } else if (user.role === "recruiter") {
        router.replace("/recruiter/dashboard");
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      router.replace("/login");
    }
  }, [dispatch, router, searchParams]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-700">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold text-indigo-600 mb-2">
          Logging you in...
        </h1>
        <p className="text-gray-500">
          Please wait while we finish authentication.
        </p>
      </div>
    </main>
  );
}
