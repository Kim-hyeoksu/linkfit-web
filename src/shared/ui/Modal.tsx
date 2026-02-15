// components/common/Modal.tsx
"use client"; // useState, useEffect 등을 사용하므로 클라이언트 컴포넌트임을 명시합니다.

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

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
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`
          fixed inset-0 z-[200]
          bg-slate-900/40 backdrop-blur-sm
          flex items-center justify-center
          animate-in fade-in duration-300
          ${backdropClassName}
        `}
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          className={`
            bg-white rounded-[32px] shadow-2xl
            max-w-md w-full p-8
            mx-5
            relative
            animate-in zoom-in-95 fade-in duration-300 ease-out
            ${className}
          `}
        >
          {!hideCloseButton && (
            <button
              onClick={onClose}
              className="
                absolute top-5 right-5
                text-slate-400 hover:text-slate-800 hover:bg-slate-100
                p-2 rounded-full transition-all active:scale-95
              "
              aria-label="모달 닫기"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          )}

          {title && (
            <h2 className="text-[22px] font-black text-slate-800 mb-6 pr-8 leading-tight tracking-tight">
              {title}
            </h2>
          )}

          <div className="text-slate-600 leading-relaxed font-medium">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
