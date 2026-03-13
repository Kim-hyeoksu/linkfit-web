import { Program } from "../";
import Link from "next/link";
import { Heart, ChevronRight } from "lucide-react";

interface Props extends Program {
  isRecent?: boolean;
}

export const ProgramCard = ({
  id,
  programName,
  period,
  dayNumber,
  likeCount,
  isRecent,
}: Props) => {
  return (
    <Link
      href={`/workout/programs/${id}/1`}
      className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all active:scale-[0.98] group"
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-bold w-fit">
            {dayNumber}일차
          </span>
        </div>
        <h3 className="text-[17px] font-bold text-slate-800 leading-tight mb-1">
          {isRecent && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-bold mr-1.5 border border-amber-100 align-middle">
              최근
            </span>
          )}
          {programName}
        </h3>
        <div className="flex items-center gap-3 mt-1 text-[13px] text-slate-400 font-medium">
          <span>{period}</span>
          <span className="flex items-center gap-1">
            <Heart size={14} className="text-red-400 fill-current" />
            {likeCount ?? 0}
          </span>
        </div>
      </div>

      <div className="text-slate-300 group-hover:text-main transition-colors pl-4">
        <ChevronRight size={24} />
      </div>
    </Link>
  );
};
