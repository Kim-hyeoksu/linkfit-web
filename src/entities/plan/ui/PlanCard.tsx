import Link from "next/link";

interface PlanCardProps {
  dayOrder: number | null;
  exerciseCount: number;
  totalVolume: number;
  title: string;
  id: number;
  programId: number;
  weekNumber: number;
  isLastExercised: boolean;
}

export const PlanCard = ({
  dayOrder,
  exerciseCount,
  totalVolume,
  title,
  id,
  programId,
  weekNumber,
  isLastExercised,
}: PlanCardProps) => {
  return (
    <Link
      href={`/workout/programs/${programId}/${weekNumber}/${id}`}
      className={`relative group flex items-center justify-between p-5 rounded-2xl border transition-all active:scale-[0.98] ${
        isLastExercised
          ? "bg-blue-50/50 border-blue-200 shadow-sm"
          : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200"
      }`}
    >
      <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2">
          {isLastExercised && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100/80 text-blue-600">
              마지막 운동
            </span>
          )}
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            Day {dayOrder ?? 1}
          </span>
        </div>

        <h3 className="text-[17px] font-bold text-slate-900 leading-tight truncate">
          {title}
        </h3>

        <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium mt-0.5">
          <span className="flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            운동 {exerciseCount}개
          </span>
          <span className="w-0.5 h-3 bg-slate-300 rounded-full" />
          <span className="flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            {Math.round(totalVolume).toLocaleString()}kg
          </span>
        </div>
      </div>

      <div
        className={`p-2 rounded-full transition-colors ${
          isLastExercised
            ? "bg-blue-100 text-blue-600"
            : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};
