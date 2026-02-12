import { PlanListItemResponse } from "../model/types";
import Link from "next/link";

interface Props {
  plan: PlanListItemResponse;
}

export const StandalonePlanCard = ({ plan }: Props) => {
  return (
    <Link
      href={`/workout/plans/${plan.id}`}
      className="flex flex-col p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all active:scale-[0.98] group relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-slate-200 group-hover:bg-main transition-colors" />

      <div className="flex items-start justify-between mb-3 pl-1">
        <h3 className="text-[17px] font-bold text-slate-800 leading-tight pr-4">
          {plan.title}
        </h3>
        <div className="text-slate-300 group-hover:text-main transition-colors">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-[12px] font-semibold border border-slate-100">
          <svg
            className="w-3.5 h-3.5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          {plan.exerciseCount} 종목
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-[12px] font-semibold border border-slate-100">
          <svg
            className="w-3.5 h-3.5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
          {plan.totalVolume?.toLocaleString() ?? 0}kg 볼륨
        </div>
      </div>
    </Link>
  );
};
