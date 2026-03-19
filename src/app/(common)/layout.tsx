import { BottomNavBar } from "@/shared";
import { ActiveSessionFAB } from "@/widgets/floating";

export default function GlobalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* 메인 콘텐츠 영역 */}
      {/*
            flex-grow: 남은 공간 채우기
            w-full: 모바일에서 꽉 차게
            max-w-screen-xl mx-auto: 데스크톱에서 최대 너비 제한 및 중앙 정렬
            p-4 md:p-8: 화면 크기에 따라 패딩 조절
          */}
      <main className="flex-grow w-full max-w-xl mx-auto">{children}</main>
      <ActiveSessionFAB />
      <BottomNavBar />
    </div>
  );
}
