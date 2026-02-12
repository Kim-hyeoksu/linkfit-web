import { StandalonePlanCard } from "@/entities/plan/ui/StandalonePlanCard";
import { getStandalonePlans } from "@/entities/plan/api";
import { Header } from "@/shared";
import Link from "next/link";
import { initMsw } from "@/shared/api/msw/initMsw";

export default async function MyPlansPage() {
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    await initMsw();
  }

  const plans = await getStandalonePlans();

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-40">
      <Header
        title="나만의 플랜"
        showBackButton={true}
        backUrl="/workout/programs"
      />

      <div className="px-5 pt-4 flex flex-col gap-4">
        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 mt-20">
            <p className="mb-4 text-lg font-medium">
              아직 생성된 플랜이 없습니다.
            </p>
            <p className="text-sm mb-8 text-slate-400">
              나만의 운동 루틴을 직접 만들어보세요!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[14px]">
            {plans.map((plan) => (
              <StandalonePlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-xl mx-auto px-5 w-full relative h-32 flex items-end pb-8 justify-end">
          <Link
            href="/workout/plans/add"
            className="pointer-events-auto h-14 w-14 rounded-full bg-main text-white shadow-lg flex items-center justify-center transition-transform active:scale-95 mb-[88px]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
