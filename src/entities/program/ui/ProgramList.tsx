import { Program } from "@/entities/program";
import { ProgramCard } from "@/entities/program";
import Link from "next/link";

interface ProgramListProps {
  programs: Program[];
  title: string;
  moreLink?: string;
}

export const ProgramList = ({
  programs,
  title,
  moreLink,
}: ProgramListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[19px] font-bold text-slate-800 tracking-tight">
          {title}
        </h2>
        {moreLink && (
          <Link
            href={moreLink}
            className="text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-0.5"
          >
            더보기
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-[14px]">
        {programs.map((program) => (
          <ProgramCard key={program.id} {...program} />
        ))}
      </div>
    </div>
  );
};
