import { getPrograms } from "@/entities/program";
import { ProgramCard } from "@/entities/program";
import Image from "next/image";
import Link from "next/link";
import { initMsw } from "@/shared/api/msw/initMsw";
import { Header } from "@/shared";
export default async function PopularProgramsPage() {
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    await initMsw(); // SSR에서 모킹 활성화
  }

  const programs = await getPrograms();

  return (
    <div className=" flex flex-col gap-2 bg-[#F7F8F9]">
      <Header title="추천 프로그램" rightButtonIconUrl={"calendar"}>
        <Image
          alt="go-calendar"
          src={`/images/common/icon/calendar.svg`}
          width={24}
          height={24}
        />
      </Header>
      <div className="p-5 bg-white gap-3 flex flex-col">
        <div className="gap-3 flex flex-col">
          {programs.map((program) => (
            <ProgramCard key={program.id} {...program} />
          ))}
        </div>
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
