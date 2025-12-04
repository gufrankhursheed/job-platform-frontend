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
    async function loadUnread() {
      try {
        const unread = await apiFetch("chat/unreadCount", { method: "GET" });
        const unreadMessages = await unread.json();
        dispatch(setUnreadCount(unreadMessages.unread || 0));
      } catch (error) {
        console.log(error);
      }
    }

    if (!shouldHideNavbar) {
      loadUnread(); // Fetch unread count on every page navigation
    }
  }, [pathname, shouldHideNavbar]);

  return (
    <>
      {!shouldHideNavbar && (
        <Navbar onMessagesClick={() => {}} onProfileClick={() => {}} />
      )}

      {children}
    </>
  );
}
