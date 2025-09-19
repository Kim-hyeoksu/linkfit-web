"use client";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Next.js 13+ App Router의 useRouter 훅
interface HeaderProps {
  title?: string; // 헤더에 표시될 제목입니다. (필수)
  showBackButton?: boolean; // 뒤로가기 버튼을 보일지 여부를 결정합니다. (기본값: true)
  backUrl?: string; // 뒤로가기 버튼 클릭 시 특정 경로로 이동하고 싶을 때 사용합니다. (지정하지 않으면 browser history.back() 동작)
  onBackClick?: () => void; // 뒤로가기 버튼 클릭 시 실행될 사용자 정의 함수입니다.
  rightButtonIconUrl?: string;
  onRightClick?: () => void;
  children: React.ReactNode;
  className?: string; // 헤더 전체에 적용될 추가 Tailwind CSS 클래스입니다.
}

const Header = ({
  title,
  showBackButton = true,
  backUrl,
  onBackClick,
  rightButtonIconUrl,
  onRightClick,
  children,
  className = "",
}: HeaderProps) => {
  const router = useRouter();
  const handleBack = () => {
    // onBackClick 함수가 제공되었다면 최우선으로 실행합니다.
    if (onBackClick) {
      onBackClick();
    }
    // backUrl가 제공되었다면 해당 경로로 이동합니다.
    else if (backUrl) {
      router.push(backUrl);
    }
    // 그 외의 경우, 브라우저의 뒤로가기 기능을 실행합니다.
    else {
      router.back();
    }
  };

  const handleRight = async () => {
    if (onRightClick) {
      await onRightClick(); // 서버 액션 / API 호출 같은 동작
    } else if (rightButtonIconUrl) {
      router.push(rightButtonIconUrl); // 단순 이동
    }
  };
  return (
    <header className="bg-white p-2 fixed top-0 left-0 right-0 z-50  h-[56px] px-5">
      <nav className="h-full mx-auto flex justify-between items-center">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="-ml-2 rounded-full hover:bg-gray-100 transition-colors" // 클릭 영역을 넓히고 호버 효과를 추가합니다.
            aria-label="뒤로가기" // 웹 접근성을 위해 스크린 리더가 읽을 텍스트를 제공합니다.
          >
            {/* 뒤로가기 아이콘 (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-gray-800" // 아이콘 크기와 색상 설정
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}{" "}
        <p className="h-full flex items-center font-bold">{title}</p>
        {children ? (
          <button
            onClick={handleRight}
            className="-ml-2 rounded-full hover:bg-gray-100 transition-colors" // 클릭 영역을 넓히고 호버 효과를 추가합니다.
            aria-label="뒤로가기" // 웹 접근성을 위해 스크린 리더가 읽을 텍스트를 제공합니다.
          >
            {children}
          </button>
        ) : (
          <div></div>
        )}
      </nav>
    </header>
  );
};

export default Header;
