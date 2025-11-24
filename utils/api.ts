import { logout } from "@/redux/slices/authSlice";
import { redirect } from "next/navigation";
import { useDispatch } from "react-redux";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5014/api";

export async function apiFetch(endpoint: string, options: RequestInit) {
  const dispatch = useDispatch();

  const config: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  let response = await fetch(`${API_BASE}/${endpoint}`, config);

  if (response.status === 401 && endpoint !== "/auth/refreshAccessToken") {
    const refreshResponse = await fetch(`${API_BASE}/auth/refreshAccessToken`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      response = await fetch(`${API_BASE}/${endpoint}`, config);
    } else {
      dispatch(logout());
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      } else {
        // On server, redirect (if possible)
        redirect("/login");
      }
      throw new Error("Unauthorized");
    }
  }

  let data;

  try {
    data = await response.json();
  } catch (error) {}

  if (!response.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
}
