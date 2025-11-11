import { Program } from "@/entities/program";
import { ProgramCard } from "@/entities/program";
import Link from "next/link";

interface ProgramListProps {
  programs: Program[];
  // loading: boolean;
  title: "운동 프로그램" | "나의 운동";
}

export default function ProgramList({ programs, title }: ProgramListProps) {
  // if (loading) return <div>로딩중...</div>;

  const linkHref =
    title === "운동 프로그램"
      ? "/workout/programs/popular"
      : "/workout/programs/mine";

  return (
    <div className="p-5 bg-white">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="text-right mb-2">
        <Link href={linkHref} className="mb-4 text-right text-[#7c7c7c]">
          더보기
        </Link>
      </div>
      <div className="gap-3 flex flex-col">
        {programs.map((program) => (
          <ProgramCard key={program.id} {...program} />
        ))}
      </div>
    </div>
  );
}
