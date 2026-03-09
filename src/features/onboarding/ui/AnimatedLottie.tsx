"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Next.js SSR에서 window/document 객체 에러를 방지하기 위해 dynamic import 적용
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface AnimatedLottieProps {
  url: string;
  className?: string;
}

export const AnimatedLottie = ({ url, className }: AnimatedLottieProps) => {
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Load failed");
        return res.json();
      })
      .then((data) => {
        setAnimationData(data);
        setError(false);
      })
      .catch((err) => {
        console.error("Lottie load failed:", err);
        setError(true);
      });
  }, [url]);

  if (error) {
    // 에러 발생 시 임시 플레이스홀더 표시 (진행이 막히지 않도록)
    return (
      <div
        className={`flex items-center justify-center bg-slate-50 rounded-2xl ${className}`}
      >
        <span className="text-slate-400 text-sm">애니메이션 로딩 실패</span>
      </div>
    );
  }

  if (!animationData) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-main animate-spin" />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Lottie animationData={animationData as any} loop={true} />
    </div>
  );
};
