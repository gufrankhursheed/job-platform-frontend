"use client";

import { loginSuccess, logout } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (user) {
        setLoading(false);
        return;
      }

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
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return { user, loading };
}
