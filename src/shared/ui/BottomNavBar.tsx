"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Utensils, Users, User } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: (isActive: boolean) => React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "홈",
    href: "/",
    icon: (isActive) => (
      <Home
        size={24}
        color={isActive ? "#111827" : "#9CA3AF"}
        strokeWidth={isActive ? 2.5 : 2}
      />
    ),
  },
  {
    name: "운동",
    href: "/workout/programs",
    icon: (isActive) => (
      <Dumbbell
        size={24}
        color={isActive ? "#111827" : "#9CA3AF"}
        strokeWidth={isActive ? 2.5 : 2}
      />
    ),
  },
  {
    name: "식단",
    href: "/diet",
    icon: (isActive) => (
      <Utensils
        size={24}
        color={isActive ? "#111827" : "#9CA3AF"}
        strokeWidth={isActive ? 2.5 : 2}
      />
    ),
  },
  {
    name: "회원관리",
    href: "/members",
    icon: (isActive) => (
      <Users
        size={24}
        color={isActive ? "#111827" : "#9CA3AF"}
        strokeWidth={isActive ? 2.5 : 2}
      />
    ),
  },
  {
    name: "마이",
    href: "/mypage",
    icon: (isActive) => (
      <User
        size={24}
        color={isActive ? "#111827" : "#9CA3AF"}
        strokeWidth={isActive ? 2.5 : 2}
      />
    ),
  },
];

export const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  // 플랜 상세 페이지(독립/프로그램 종속)에서는 하단 바를 숨깁니다.
  const isPlanDetailPage =
    /^\/workout\/plans\/[^\/]+$/.test(pathname) ||
    /^\/workout\/programs\/[^\/]+\/[^\/]+\/[^\/]+$/.test(pathname);

  if (isPlanDetailPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 h-[60px] pb-safe">
      <div className="w-full h-full flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex flex-col items-center justify-center
                flex-1 h-full
                transition-colors duration-200
                ${isActive ? "text-gray-900" : "text-gray-400"}
              `}
            >
              <div className="mb-0.5">{item.icon(isActive)}</div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
