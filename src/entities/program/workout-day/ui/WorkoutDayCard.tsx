import { WorkoutDay } from "../model/types";
import Image from "next/image";
import Link from "next/link";
export default function WorkoutDayCard({
  dayNumber,
  exercisesCount,
  totalVolumeKg,
  id,
  programId,
}: WorkoutDay) {
  return (
    <div className="relative p-3 border border-[#e5e5e5] rounded-lg bg-white shadow">
      <div className="flex items-center mb-2">
        <p className="text-sm text-gray-600 mr-2">{dayNumber}일차</p>
        <h2 className="">{exercisesCount}</h2>
      </div>
      <p className="text-sm text-gray-600">{totalVolumeKg}</p>
      <Link
        href={`/workout/programs/${programId}/1/${id}`}
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
}
