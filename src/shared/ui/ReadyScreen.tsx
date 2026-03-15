"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LottiePlayer } from "./LottiePlayer";

interface ReadyScreenProps {
  title?: string;
  description?: string;
}

/**
 * @name ReadyScreen
 * @description 준비 중인 화면을 표시할 때 사용하는 공통 컴포넌트입니다.
 * 역도 애니메이션과 센스 있는 문구로 제작되었습니다.
 */
export const ReadyScreen = ({
  title = "열심히 벌크업 소화 중!",
  description = "더 강력한 기능을 보여드리기 위해\n마지막 한 개까지 혼신의 힘으로 소화하고 있어요.\n잠시만 기다려 주시면 완벽한 모습으로 찾아올게요!",
}: ReadyScreenProps) => {
  const router = useRouter();
  const lottieUrl =
    "https://lottie.host/de6b3264-e026-4ed6-8cf5-bf9cb765c680/HoQ35YZO26.lottie";

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-8 text-center animate-in fade-in zoom-in-95 duration-700">
      <LottiePlayer
        url={lottieUrl}
        className="w-72 h-72 mb-10 drop-shadow-2xl flex items-center justify-center"
      />

      <div className="space-y-4 mb-14">
        <h2 className="text-[22px] font-black text-slate-800 tracking-tight leading-tight">
          {title}
        </h2>

        <p className="text-[16px] text-slate-500 font-medium leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      </div>

      <button
        onClick={() => router.back()}
        className="group relative flex items-center gap-3 px-8 py-4.5 bg-white border-2 border-slate-100 text-slate-700 font-black rounded-[24px] shadow-sm hover:shadow-xl hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 active:scale-95"
      >
        <ArrowLeft
          size={20}
          strokeWidth={3}
          className="group-hover:-translate-x-1 transition-transform"
        />
        이전 페이지로 돌아가기
      </button>
    </div>
  );
};
