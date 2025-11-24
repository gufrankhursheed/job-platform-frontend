import { logout } from "@/redux/slices/authSlice";
import { redirect } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5014/api";

export async function apiFetch(endpoint: string, options: RequestInit) {

  const config: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  let response = await fetch(`${API_BASE}/${endpoint}`, config);

  if (response.status === 401 && endpoint !== "auth/refreshAccessToken") {
    const refreshResponse = await fetch(`${API_BASE}/auth/refreshAccessToken`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      response = await fetch(`${API_BASE}/${endpoint}`, config);
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      } else {
        // On server, redirect (if possible)
        redirect("/login");
      }
      throw new Error("Unauthorized");
    }
  }

  return response;
}
