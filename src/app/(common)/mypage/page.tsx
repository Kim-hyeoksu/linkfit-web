"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { userState } from "@/entities/user/model/userState";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { accessTokenState } from "@/features/auth/model/accessTokenState";
import { Header } from "@/shared";

export default function MyPage() {
  const user = useAtomValue(userState);
  const setAccessToken = useSetAtom(accessTokenState);
  const setUser = useSetAtom(userState);
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      setAccessToken(null);
      setUser(null);
      router.push("/login");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pb-24 flex items-center justify-center">
        <div className="text-gray-500">로그인 정보가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      <Header title="마이페이지" showBackButton={false} />

      <main className="px-5 pt-4 flex flex-col gap-6">
        {/* 프로필 카드 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-1 flex gap-2">
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                {user.userType === "TRAINER" ? "트레이너" : "일반 회원"}
              </span>
              <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium">
                Lv. {user.exerciseLevel || "초급"}
              </span>
            </div>
          </div>
        </section>

        {/* 메뉴 리스트 */}
        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
          <MenuItem icon="settings" label="내 정보 수정" onClick={() => {}} />
          <MenuItem icon="bell" label="알림 설정" onClick={() => {}} />
        </section>

        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
          <MenuItem
            icon="help-circle"
            label="고객센터 / 문의하기"
            onClick={() => {}}
          />
          <MenuItem icon="file-text" label="이용약관" onClick={() => {}} />
          <MenuItem
            icon="shield"
            label="개인정보 처리방침"
            onClick={() => {}}
          />
        </section>

        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors text-red-500 font-medium"
          >
            <div className="flex items-center gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>로그아웃</span>
            </div>
          </button>
        </section>

        <div className="text-center text-xs text-gray-400 py-4">
          앱 버전 1.0.0
        </div>
      </main>
    </div>
  );
}

// 아이콘 매핑을 위한 간단한 컴포넌트
const MenuItem = ({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-300"
      >
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  );
};
