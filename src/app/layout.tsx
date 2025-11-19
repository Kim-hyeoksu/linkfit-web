// app/layout.tsx

// 1. 필요한 모듈들을 불러옵니다.
// Metadata: Next.js에서 SEO와 웹 접근성 등을 위한 메타데이터를 정의할 때 사용합니다.
import type { Metadata } from "next";
import { initMsw } from "@/shared/api/msw/initMsw";
import "./globals.css";
import { MswProvider } from "@/shared";
// if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
//   await initMsw();
// }
// 브라우저 탭에 표시되는 제목, 검색 엔진에 노출되는 설명 등을 설정할 수 있어요.
export const metadata: Metadata = {
  title: "김혁수님의 멋진 웹 서비스", // 웹사이트의 기본 제목입니다.
  description: "모바일 친화적인 사용자 경험을 제공하는 혁신적인 서비스입니다!", // 웹사이트 설명입니다.
  // Next.js 13+ App Router에서는 viewport meta tag (width=device-width, initial-scale=1.0)가 기본으로 포함되므로 따로 작성하지 않아도 괜찮아요!
};

// 이 컴포넌트는 애플리케이션의 모든 페이지를 감싸는 최상위 레이아웃입니다.
// `children` prop을 통해 실제 페이지 내용이 여기에 렌더링됩니다.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // HTML 문서의 언어를 한국어(ko)로 설정합니다.
    <html lang="ko">
      {/*
        <body> 태그 안에 애플리케이션의 모든 내용이 들어갑니다.
        여기에는 전역적으로 적용될 CSS 클래스(예: Tailwind CSS의 flex, min-h-screen)를 적용할 수 있습니다.
        이렇게 하면 모든 페이지가 최소한 화면 높이만큼을 차지하고, flexbox 컨테이너가 되어 내부 요소 정렬에 유리해집니다.
      */}
      <body className="flex flex-col min-h-screen">
        {/*
          'children'은 현재 라우트에서 렌더링될 페이지 또는 중첩 레이아웃의 콘텐츠를 나타냅니다.
          예를 들어, Home 페이지(app/page.tsx)의 내용이 여기에 들어오게 됩니다.
        */}
        <MswProvider>{children}</MswProvider>
      </body>
    </html>
  );
}
