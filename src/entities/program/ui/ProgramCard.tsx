import { Program } from "../";
import Link from "next/link";

export const ProgramCard = ({
  id,
  programName,
  period,
  dayNumber,
  likeCount,
}: Program) => {
  return (
    <Link
      href={`/workout/programs/${id}/1`}
      className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all active:scale-[0.98] group"
    >
      <div className="flex flex-col">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-bold mb-2 w-fit">
          {dayNumber}일차
        </span>
        <h3 className="text-[17px] font-bold text-slate-800 leading-tight mb-1">
          {programName}
        </h3>
        <div className="flex items-center gap-3 mt-1 text-[13px] text-slate-400 font-medium">
          <span>{period}</span>
          <span className="flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-red-400"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {likeCount ?? 0}
          </span>
        </div>
      </div>

      <div className="text-slate-300 group-hover:text-main transition-colors pl-4">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
};
