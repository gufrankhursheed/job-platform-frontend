"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function GoogleSuccessPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    async function completeGoogleLogin() {
      try {
        // Fetch authenticated user using cookies
        const res = await fetch(
          "http://localhost:5014/api/auth/getCurrentUser",
          {
            method: "GET",
            credentials: "include", // important
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user");

        const user = await res.json();

        dispatch(loginSuccess({ user }));

        // Redirect based on role
        if (user.role === "candidate") {
          router.replace("/candidate/dashboard");
        } else if (user.role === "recruiter") {
          router.replace("/recruiter/dashboard");
        } else {
          router.replace("/dashboard");
        }
      } catch (err) {
        console.log("OAuth success error:", err);
        setStatus("error");

        // Redirect after slight delay so user sees message
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      }
    }

    completeGoogleLogin();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 p-6">
      <section className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-extrabold text-indigo-600 mb-4">
              Logging you in...
            </h1>
            <p className="text-gray-600 mb-4">
              Please wait while we verify your Google account.
            </p>

            <div className="flex justify-center mt-4">
              <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-extrabold text-red-600 mb-4">
              Login Failed
            </h1>
            <p className="text-gray-600 mb-4">
              Something went wrong while logging in with Google.
            </p>

            <div className="text-gray-500 text-sm">
              Redirecting you back to login...
            </div>
          </>
        )}
      </section>
    </main>
  );
}
