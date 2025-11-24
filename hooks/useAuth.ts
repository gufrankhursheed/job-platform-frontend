"use client";

import { loginSuccess, logout } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useAuth() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    async function loadUser() {
      if (user) return user;

      try {
        const response = await fetch(
          "http://localhost:5014/api/auth/getCurrentUser",
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Not logged in");

        const data = await response.json();

        dispatch(loginSuccess({ user: data }));
      } catch (error) {
        dispatch(logout());
        router.replace("/login");
      }
    }

    loadUser()
  }, []);

  return user;
}
