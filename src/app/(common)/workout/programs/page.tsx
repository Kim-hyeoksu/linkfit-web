// ProgramsPage.tsx
// "use client";

// import { useEffect, useState } from "react";
import { getPrograms } from "@/entities/program";
import { ProgramList } from "@/entities/program";
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
    <div className=" flex flex-col gap-2 bg-[#F7F8F9]">
      <Header
        title="운동"
        showBackButton={false}
        rightButtonIconUrl={"calendar"}
      >
        <Image
          alt="go-calendar"
          src={`/images/common/icon/calendar.svg`}
          width={24}
          height={24}
        />
      </Header>
      <div>
        <ProgramList programs={programs} title={"운동 프로그램"} />
        <ProgramList programs={programs} title={"나의 운동"} />
      </div>
      <div className="bg-white flex justify-center p-5">
        <Link
          href={"/workout/programs/add"}
          className="flex justify-center items-cetner gap-1 border border-[#d9d9d9] rounded-lg w-full p-2"
        >
          <Image
            alt="add-program"
            src="/images/common/icon/add_circle_outline_24px.svg"
            width={20}
            height={20}
          />
          루틴 추가하기
        </Link>
      </div>
    </div>
  );
}
