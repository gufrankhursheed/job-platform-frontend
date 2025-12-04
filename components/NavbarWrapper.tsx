"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import useAuth from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { apiFetch } from "@/utils/api";
import { setUnreadCount } from "@/redux/slices/chatSlice";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuth();

  const dispatch = useDispatch();

  // Pages where navbar must NOT appear
  const hideOnRoutes = ["/", "/login", "/register"];

  const shouldHideNavbar = hideOnRoutes.includes(pathname) || !user;

  useEffect(() => {
    try {
      async function load() {
      const unread = await apiFetch("chat/unreadCount", { method: "GET" });
      const unreadMessages = await unread.json();
      const unreadMessagesCount = unreadMessages.unread || 0;

      dispatch(setUnreadCount(unreadMessagesCount));
    }

    load()
    } catch (error) {
       console.log(error);
    }
  }, []);

  return (
    <>
      {!shouldHideNavbar && (
        <Navbar
          onMessagesClick={() => {}}
          onProfileClick={() => {}}
        />
      )}

      {children}
    </>
  );
}
