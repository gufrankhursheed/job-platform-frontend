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
    <nav className="w-full bg-white shadow-md sticky top-0 z-50 border-b border-indigo-100">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
        >
          Job Platform
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Messages */}
          <button
            onClick={onMessagesClick}
            className="relative p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition shadow-sm cursor-pointer"
          >
            <FiMessageSquare className="text-2xl text-indigo-700" />

            {unreadMessages > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-[1px] rounded-full shadow"
              >
                {unreadMessages}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={onProfileClick}
            className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition shadow-sm cursor-pointer"
          >
            <FiUser className="text-2xl text-indigo-700" />
          </button>
        </div>
      </div>
    </nav>
  );
}
