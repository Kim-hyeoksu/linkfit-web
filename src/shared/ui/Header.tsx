"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  title?: string | number; // 헤더에 표시될 제목입니다. (필수)
  showBackButton?: boolean; // 뒤로가기 버튼을 보일지 여부를 결정합니다. (기본값: true)
  backUrl?: string; // 뒤로가기 버튼 클릭 시 특정 경로로 이동하고 싶을 때 사용합니다. (지정하지 않으면 browser history.back() 동작)
  onBackClick?: () => void; // 뒤로가기 버튼 클릭 시 실행될 사용자 정의 함수입니다.
  rightButtonIconUrl?: string;
  onRightClick?: () => void;
  children?: React.ReactNode;
  className?: string; // 헤더 전체에 적용될 추가 Tailwind CSS 클래스입니다.
}

export const Header = ({
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
  useEffect(() => {}, [title]);
  return (
    <header
      className={`bg-white sticky top-0 left-0 right-0 z-50 h-[64px] border-b border-slate-100 px-5 flex items-center justify-center ${className}`}
    >
      <nav className="relative mx-auto flex justify-between items-center w-full max-w-xl h-full">
        <div className="flex items-center z-10">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="-ml-2 p-2 rounded-xl text-slate-800 hover:bg-slate-50 transition-all active:scale-95"
              aria-label="뒤로가기"
            >
              <ChevronLeft size={26} className="text-gray-900" />
            </button>
          )}
        </div>

        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[17px] font-black text-slate-800 tracking-tight whitespace-nowrap">
          {title}
        </p>

        <div className="flex items-center justify-end z-10 gap-2">
          {children ? (
            <div
              onClick={handleRight}
              className="rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              {children}
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
};
