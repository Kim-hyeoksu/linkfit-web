import Image from "next/image";
import Link from "next/link";
export const PlanCard = ({
  dayOrder,
  exerciseCount,
  totalVolume,
  title,
  id,
  programId,
  weekNumber,
  isLastExercised,
}: {
  dayOrder: number | null;
  exerciseCount: number;
  totalVolume: number;
  title: string;
  id: number;
  programId: number;
  weekNumber: number;
  isLastExercised: boolean;
}) => {
  return (
    <div className="relative p-3 border border-[#e5e5e5] rounded-lg bg-white shadow">
      <div className="flex items-center gap-2 mt-1">
        <p className="text-sm text-gray-600">
          {dayOrder != null ? `${dayOrder}일차` : "일차"}
        </p>
        <h2 className="font-bold text-sm line-clamp-1">{title}</h2>
        {isLastExercised && (
          <span className="text-xs text-white bg-blue-500 rounded-full px-2 pt-0.5">
            마지막 운동
          </span>
        )}
      </div>
      <div className="mt-2 flex gap-3 text-xs text-gray-600">
        <div>운동 {exerciseCount}개</div>
        <div>총 볼륨 {Math.round(totalVolume)}kg</div>
      </div>
      <Link
        href={`/workout/programs/${programId}/${weekNumber}/${id}`}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <Image
          src="/images/common/arrow_forward_ios_24px.svg"
          alt="arrow-right"
          width={16}
          height={16}
        />
      </Link>
    </div>
  );
};
