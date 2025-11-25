"use client";

import ProtectedAuthPage from "@/components/ProtectedAuthPage";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <ProtectedAuthPage>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 p-6">
        <section className="max-w-lg text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600 mb-4">
            Smart Job Platform
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600">
            Find your dream job, connect with recruiters, and track applications
            — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="cursor-pointer px-8 py-3 rounded-lg font-medium bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-all"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="cursor-pointer px-8 py-3 rounded-lg font-medium bg-white border border-indigo-600 text-indigo-600 shadow hover:bg-indigo-50 transition-all"
            >
              Sign Up
            </button>
          </div>
        </section>
      </main>
    </ProtectedAuthPage>
  );
}
