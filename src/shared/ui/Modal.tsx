// components/common/Modal.tsx
"use client"; // useState, useEffect 등을 사용하므로 클라이언트 컴포넌트임을 명시합니다.

import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean; // 모달이 열려있는지 닫혀있는지 제어하는 prop (필수)
  onClose: () => void; // 모달이 닫힐 때 호출될 함수 (필수)
  title?: string; // 모달의 제목 (선택 사항)
  children: React.ReactNode; // 모달 내용 (필수)
  className?: string; // 모달 본문에 적용될 추가 Tailwind CSS 클래스 (선택 사항)
  backdropClassName?: string; // 배경(backdrop)에 적용될 추가 Tailwind CSS 클래스 (선택 사항)
  hideCloseButton?: boolean; // 닫기 버튼 숨기기 여부 (기본값: false)
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  backdropClassName = "",
  hideCloseButton = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null); // 모달 본문을 참조할 ref

  // 1. 모달이 열려있을 때 body 스크롤 방지 및 Escape 키 감지
  useEffect(() => {
    if (isOpen) {
      // 모달이 열리면 body에 overflow-hidden 클래스를 추가하여 스크롤 방지
      document.body.style.overflow = "hidden";

      // Escape 키 감지 핸들러
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose(); // Escape 키 누르면 모달 닫기
        }
      };

      // 전역 window 객체에 이벤트 리스너 추가
      window.addEventListener("keydown", handleEscape);

      // 클린업 함수: 컴포넌트 언마운트되거나 isOpen이 false가 될 때 실행
      return () => {
        document.body.style.overflow = ""; // body 스크롤 다시 허용
        window.removeEventListener("keydown", handleEscape); // 이벤트 리스너 제거
      };
    } else {
      // 모달이 닫히면 body 스크롤 다시 허용 (혹시 모를 상황 대비)
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose]); // isOpen 또는 onClose 함수가 변경될 때마다 이펙트 재실행

  // 2. 배경(backdrop) 클릭 시 모달 닫기 (모달 본문 클릭은 무시)
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // 클릭된 요소가 배경(modalRef.current의 부모)인 경우에만 닫기
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  // isOpen이 false일 때는 아무것도 렌더링하지 않습니다.
  if (!isOpen) return null;

  return (
    <>
      {/* 모달 배경 (Backdrop) */}
      <div
        className={`
          fixed inset-0 z-50 // 화면 전체를 덮고 가장 위에 위치
          bg-black/30 // 적당히 어두운 반투명 배경
          flex items-center justify-center // 모달 내용을 중앙에 배치
          ${backdropClassName} // 추가 배경 클래스
        `}
        onClick={handleBackdropClick} // 배경 클릭 시 닫기 핸들러 연결
      >
        {/* 모달 본문 */}
        <div
          ref={modalRef} // ref 연결 (배경 클릭 이벤트 처리용)
          role="dialog" // 접근성을 위해 role="dialog" 설정
          aria-modal="true" // 접근성을 위해 aria-modal="true" 설정
          className={`
            bg-white rounded-lg shadow-xl // 흰색 배경, 둥근 모서리, 그림자
            max-w-md w-full p-6 // 최대 너비, 전체 너비, 내부 패딩
            mx-4 // 좌우 마진 (작은 화면에서 꽉 차지 않도록)
            relative // 닫기 버튼 절대 위치 지정을 위해
            transform // transition-transform 효과 적용을 위해
            scale-100 opacity-100 // 초기 상태 (열릴 때)
            transition-transform transition-opacity duration-300 ease-out // 부드러운 전환 효과

            ${className} // 외부에서 받은 추가 클래스
          `}
          // 추가적으로 애니메이션 효과를 위해 CSS transition 속성을 활용할 수 있습니다.
          // 예: transition-transform duration-300 ease-out transform scale-95
          // 이렇게 하면 모달이 나타날 때 약간 작게 시작해서 커지는 효과를 줄 수 있습니다.
        >
          {/* 닫기 버튼 (숨김 설정이 아닐 때만 렌더링) */}
          {!hideCloseButton && (
            <button
              onClick={onClose}
              className="
                absolute top-3 right-3 // 모달 본문 상단 우측에 절대 위치
                text-gray-500 hover:text-gray-800 // 색상 및 호버 효과
                p-1 rounded-full // 패딩 및 둥근 모서리
                focus:outline-none focus:ring-2 focus:ring-blue-500 // 포커스 스타일
              "
              aria-label="모달 닫기" // 접근성
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}

          {/* 모달 제목 (선택 사항) */}
          {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

          {/* 모달 내용 */}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
