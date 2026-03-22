"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * 스크롤이 끝에 도달했을 때 콜백을 실행하는 hook
 */
export const useIntersectionObserver = (
  callback: () => void,
  options: IntersectionObserverInit = { threshold: 1.0 }
) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const onIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(onIntersect, options);
    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [onIntersect, options]);

  return targetRef;
};
