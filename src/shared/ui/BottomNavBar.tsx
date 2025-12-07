"use client"; // useRouter와 usePathname 훅 사용을 위해 클라이언트 컴포넌트임을 명시

import React from "react";
import Image from "next/image"; // next/image 컴포넌트 사용을 위해 import
import Link from "next/link";
import { usePathname } from "next/navigation"; // 현재 경로를 가져오는 훅

// NavItem 인터페이스를 업데이트합니다.
// icon 속성이 활성화 여부에 따라 다른 ReactNode를 반환하는 함수 타입으로 변경됩니다.
interface NavItem {
  name: string; // 메뉴 이름
  href: string; // 이동할 경로
  icon: (isActive: boolean) => React.ReactNode; // 활성화 여부에 따라 다른 아이콘 컴포넌트를 반환하는 함수
}

const navItems: NavItem[] = [
  {
    name: "홈",
    href: "/",
    icon: (isActive) => (
      <Image
        src={
          isActive
            ? "/images/icons/home-selected.png" // 활성화 시 홈 아이콘 (선택됨)
            : "/images/icons/home-unselected.png" // 비활성화 시 홈 아이콘 (기본)
        }
        width={24}
        height={24}
        alt="홈 아이콘"
      />
    ),
  },
  {
    name: "운동",
    href: "/workout/programs", // 예시 경로: 실제 운동 관련 페이지 경로로 변경해주세요.
    icon: (isActive) => (
      <Image
        src={
          isActive
            ? "/images/icons/exercise-selected.png" // 활성화 시 운동 아이콘
            : "/images/icons/exercise-unselected.png" // 비활성화 시 운동 아이콘
        }
        width={24}
        height={24}
        alt="운동 아이콘"
      />
    ),
  },
  {
    name: "식단",
    href: "/diet", // 예시 경로: 실제 식단 관련 페이지 경로로 변경해주세요.
    icon: (isActive) => (
      <Image
        src={
          isActive
            ? "/images/icons/diet-selected.png" // 활성화 시 식단 아이콘
            : "/images/icons/diet-unselected.png" // 비활성화 시 식단 아이콘
        }
        width={24}
        height={24}
        alt="식단 아이콘"
      />
    ),
  },
  {
    name: "회원관리",
    href: "/members", // 예시 경로: 실제 회원 관리 페이지 경로로 변경해주세요.
    icon: (isActive) => (
      <Image
        src={
          isActive
            ? "/images/icons/members-selected.png" // 활성화 시 회원관리 아이콘
            : "/images/icons/members-unselected.png" // 비활성화 시 회원관리 아이콘
        }
        width={24}
        height={24}
        alt="회원관리 아이콘"
      />
    ),
  },
  {
    name: "마이페이지",
    href: "/login", // 예시 경로: 실제 마이페이지 경로로 변경해주세요.
    icon: (isActive) => (
      <Image
        src={
          isActive
            ? "/images/icons/my-selected.png" // 활성화 시 마이페이지 아이콘
            : "/images/icons/my-unselected.png" // 비활성화 시 마이페이지 아이콘
        }
        width={24}
        height={24}
        alt="마이페이지 아이콘"
      />
    ),
  },
];

export const BottomNavBar: React.FC = () => {
  const pathname = usePathname(); // 현재 URL 경로를 가져옵니다.

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-40 // 하단에 고정하고 다른 요소 위에 오도록 z-index 설정
        bg-white // 배경색은 흰색
        border-t border-gray-200 // 상단에 얇은 구분선
        flex justify-around items-center // 아이템들을 균등하게 배치하고 수직 중앙 정렬
        h-[72px] // 내비게이션 바의 높이
        py-2 // 상하 패딩
      "
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href} // 아이템 클릭 시 이동할 경로
            className={`
              flex flex-col items-center justify-center // 아이콘과 텍스트를 수직으로 배치하고 중앙 정렬
              flex-1 
              text-center // 텍스트 중앙 정렬
              p-1 // 내부 패딩
              transition-colors duration-200 ease-in-out // 색상 전환 시 부드러운 애니메이션
              ${
                isActive // 현재 아이템이 활성 상태인 경우
                  ? "text-blue-600 font-semibold" // 활성 상태 텍스트 스타일 (파란색, 굵은 글씨)
                  : "text-gray-500" // 비활성 상태 텍스트 스타일 (회색)
              }
            `}
          >
            {/* ✨ icon이 함수이므로, isActive를 인자로 전달하여 호출한 결과를 렌더링합니다. */}
            {/* <div className="mb-1">{item.icon(isActive)}</div> */}
            {/* 메뉴 이름 */}
            <span className="text-xs">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
