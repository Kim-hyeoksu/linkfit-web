import { PlanListItemResponse } from "../model/types";
import { StandalonePlanCard } from "@/entities/plan/ui/StandalonePlanCard";
import Link from "next/link";
import Image from "next/image";

interface StandalonePlanListProps {
  plans: PlanListItemResponse[];
  title: string;
  moreLink?: string;
  onCreateNewPlan?: () => void;
}

export const StandalonePlanList = ({
  plans,
  title,
  moreLink,
  onCreateNewPlan,
}: StandalonePlanListProps) => {
  if (plans.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-[19px] font-bold text-slate-800 tracking-tight px-1">
          {title}
        </h2>
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-100 rounded-2xl gap-3">
          <p className="text-sm text-slate-500 font-medium">
            아직 생성된 플랜이 없어요
          </p>
          <Link
            href="/workout/plans/add"
            className="text-sm font-bold text-main hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <span className="w-5 h-5 rounded-full bg-blue-100 text-main flex items-center justify-center font-bold">
              +
            </span>
            첫 번째 플랜 만들기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[19px] font-bold text-slate-800 tracking-tight">
            {title}
          </h2>
          <Link
            href="/workout/plans/add"
            className="w-6 h-6 rounded-full bg-blue-50 text-main flex items-center justify-center transition-transform active:scale-95"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Link>
        </div>

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
        {plans.map((plan) => (
          <StandalonePlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
};
