"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/common/Header";
import { useState } from "react";
const ProgramAddPage = () => {
  const [workoutFrequencyPerWeek, setWorkoutFrequencyPerWeek] = useState([]);
  const [workoutDaysOfWeek, setWorkoutDaysOfWeek] = useState([]);

  return (
    <div className=" flex flex-col gap-2 bg-[#F7F8F9]">
      <Header title="새로운 루틴">
        <div>(0/15)</div>
      </Header>
      <div className="p-5 bg-white gap-3 flex flex-col">
        <Link
          href={"/workout/programs/add"}
          className="flex justify-center items-cetner gap-1 border border-[#d9d9d9] rounded-lg w-full p-2"
        >
          <Image
            alt="add-program"
            src="/images/common/icon/add_circle_outline_24px.svg"
            width={20}
            height={20}
          />
          운동 추가하기
        </Link>
      </div>
    </div>
  );
};

export default ProgramAddPage;
