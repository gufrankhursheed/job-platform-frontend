"use client";

import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface LoginForm {
  identifier: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter(); 
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);
  const dispatch = useDispatch();

  const [form, setForm] = useState<LoginForm>({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!form.identifier.trim()) {
      newErrors.identifier = "Username or email is required";
    }
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(loginStart());

    try {
      const response = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.identifier,
          email: form.identifier,
          password: form.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch(loginFailure(data.message || "Login Failed"));
        return;
      }

      dispatch(
        loginSuccess({ user: data.loggedInUser})
      );

      if (data.loggedInUser.role === "candidate") {
        router.push("/candidate/dashboard");
      } else if (data.loggedInUser.role === "recruiter") {
        router.push("/recruiter/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      dispatch(loginFailure("Network error, please try again"));
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5014/api/auth/google";
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 p-6">
      <section className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-indigo-600 text-center">
          Login to Your Account
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="identifier" className="block font-semibold mb-1">
              Username or Email
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={form.identifier}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.identifier ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter username or email"
              disabled={!!loading}
            />
            {errors.identifier && (
              <p className="text-sm text-red-600 mt-1">{errors.identifier}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
              disabled={!!loading}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!!loading}
            className="cursor-pointer w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            disabled={!!loading}
            className="cursor-pointer text-indigo-600 font-semibold hover:underline"
            onClick={() => router.push("/register")}
          >
            Sign Up here
          </button>
        </p>

        <div className="mt-6 flex flex-col items-center">
          <p className="text-gray-500 mb-2">Or login with</p>
          <button
            onClick={handleGoogleLogin}
            disabled={!!loading}
            className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className="w-5 h-5"
            />
            <span className="font-semibold text-gray-700">Login with Google</span>
          </button>
        </div>
      </section>
    </main>
  );
}
