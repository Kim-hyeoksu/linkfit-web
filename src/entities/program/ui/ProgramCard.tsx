import { Program } from "../";
import Link from "next/link";

export const ProgramCard = ({
  id,
  programName,
  period,
  dayNumber,
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
        <div className="text-[13px] text-slate-400 font-medium flex items-center gap-1">
          <span>{period}</span>
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
