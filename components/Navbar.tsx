"use client";

import { FiUser, FiMessageSquare } from "react-icons/fi";
import Link from "next/link";

export default function Navbar({
    unreadMessages = 0,
    onMessagesClick,
    onProfileClick
}: {
    unreadMessages?: number;
    onMessagesClick?: () => void; 
    onProfileClick?: () => void;
}) {
  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <Link href="/" className="text-xl font-bold text-gray-900">
          Job Platform
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {/* Messages Icon */}
          <button
            onClick={onMessagesClick}
            className="relative hover:opacity-80 transition"
          >
            <FiMessageSquare className="text-2xl text-gray-700" />

            {/* Unread Badge */}
            { unreadMessages > 0 && (
              <span
                className="
                absolute -top-1 -right-2 bg-red-500 text-white text-xs
                px-1.5 py-[1px] rounded-full
              "
              >
                {unreadMessages}
              </span>
            )}
          </button>

          {/* Profile Icon */}
          <button
            onClick={onProfileClick}
            className="hover:opacity-80 transition"
          >
            <FiUser className="text-2xl text-gray-700" />
          </button>
        </div>
      </div>
    </nav>
  );
}
