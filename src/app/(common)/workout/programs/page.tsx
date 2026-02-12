// ProgramsPage.tsx
// "use client";

// import { useEffect, useState } from "react";
import { getPrograms, ProgramList } from "@/entities/program";
import Image from "next/image";
import Link from "next/link";
import { initMsw } from "@/shared/api/msw/initMsw";
import { Header } from "@/shared";
export default async function ProgramsPage() {
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    await initMsw(); // SSR에서 모킹 활성화
  }

  const programs = await getPrograms();

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-40">
      <Header
        title="운동 프로그램"
        showBackButton={false}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60"
        rightButtonIconUrl={"calendar"}
      >
        <Image
          alt="history"
          src={`/images/common/icon/calendar.svg`}
          width={24}
          height={24}
          className="opacity-60 hover:opacity-100 transition-opacity"
        />
      </Header>

      <div className="px-5 pt-6 flex flex-col gap-8">
        <ProgramList
          programs={programs}
          title={"추천 프로그램"}
          moreLink="/workout/programs/popular"
        />
        <ProgramList
          programs={programs}
          title={"나의 운동 루틴"}
          moreLink="/workout/programs/mine"
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 w-full max-w-xl mx-auto px-5 pointer-events-none">
        <Link
          href={"/workout/programs/add"}
          className="pointer-events-auto h-[56px] w-full mb-24 flex items-center justify-center gap-2 bg-main text-white rounded-2xl font-bold text-[16px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Image
            alt="add"
            src="/images/common/icon/add_circle_outline_24px.svg"
            width={24}
            height={24}
            className="brightness-0 invert"
          />
          <span>새로운 루틴 만들기</span>
        </Link>
      </div>
    </div>
  );
}
