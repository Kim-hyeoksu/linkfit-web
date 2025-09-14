import { Program } from "../model/types";
import Image from "next/image";
export default function ProgramCard({ id, title, period, dayNumber }: Program) {
  return (
    <div className="relative p-3 border border-[#e5e5e5] rounded-lg bg-white shadow">
      <div className="flex items-center mb-2">
        <p className="text-sm text-gray-600 mr-2">{dayNumber}일차</p>
        <h2 className="">{title}</h2>
      </div>
      <p className="text-sm text-gray-600">{period}</p>
      <button className="absolute right-3 top-1/2 -translate-y-1/2">
        <Image
          src="/images/common/arrow_forward_ios_24px.svg"
          alt="arrow-right"
          width={16}
          height={16}
        />
      </button>
    </div>
  );
}
