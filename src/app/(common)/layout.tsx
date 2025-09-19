import type { Metadata } from "next";

import BottomNavBar from "@/components/common/BottomNavBar";
import Header from "@/components/common/header";

// 전역 메타데이터 정의
export const metadata: Metadata = {
  title: "김혁수님의 모바일 친화적인 서비스",
  description: "모두를 위한 최고의 사용자 경험을 제공합니다!",
  // 뷰포트 메타 태그는 Next.js App Router에서 기본적으로 포함됩니다.
  // <meta name="viewport" content="width=device-width, initial-scale=1.0" />
};

export default function ProgramsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 메인 콘텐츠 영역 */}
      {/*
            flex-grow: 남은 공간 채우기
            w-full: 모바일에서 꽉 차게
            max-w-screen-xl mx-auto: 데스크톱에서 최대 너비 제한 및 중앙 정렬
            p-4 md:p-8: 화면 크기에 따라 패딩 조절
          */}
      <main className="flex-grow w-full max-w-screen-xl md:p-8 pt-[56px]">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
}
