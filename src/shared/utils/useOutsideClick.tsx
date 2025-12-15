"use client";
import { useEffect, useRef } from "react";

/**
 * useOutsideClick
 * - ref 영역 바깥 클릭 시 handler 호출
 *
 * @param ref - 클릭 감지할 DOM ref
 * @param handler - 바깥 클릭 시 실행할 함수
 */
export function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // ref가 없거나 클릭 대상이 ref 안에 있으면 무시
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(); // 바깥 클릭 시 실행
      console.log("useOutsideClick handler called");
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener); // 모바일 지원

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
