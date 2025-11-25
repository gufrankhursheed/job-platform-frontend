"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import useAuth from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuth();

  // From Redux: global unread messages count (Day 6 logic)
  const unreadMessages = useSelector((state: RootState) => state.chat.unreadCount ?? 0);

  // Pages where navbar must NOT appear
  const hideOnRoutes = ["/", "/login", "/register"];

  const shouldHideNavbar = hideOnRoutes.includes(pathname) || !user;

  return (
    <>
      {!shouldHideNavbar && (
        <Navbar
          unreadMessages={unreadMessages}
          onMessagesClick={() => {}}
          onProfileClick={() => {}}
        />
      )}

      {children}
    </>
  );
}
