"use client";
import { Header, Modal } from "@/shared";
import { useState } from "react";

const ProgramAddPage = () => {
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [frequencyPerWeek, setFrequencyPerWeek] = useState(3);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);

  return (
    <div className=" flex flex-col gap-2 bg-[#F7F8F9]">
      <Header title="새로운 루틴">
        <div>(0/15)</div>
      </Header>
      <div className="p-5 bg-white gap-3 flex flex-col">
        {/* 빈도 설정 버튼 */}
        <div
          onClick={() => setIsFrequencyModalOpen(true)}
          className="border border-[#e5e5e5] rounded-lg p-4 flex justify-between items-center cursor-pointer bg-white"
        >
          <span className="font-bold text-gray-700">운동 일정</span>
          <span className="text-blue-500 font-medium">
            {durationWeeks}주간 주 {frequencyPerWeek}회
          </span>
        </div>
      </div>

      {/* 빈도 설정 모달 */}
      <Modal
        isOpen={isFrequencyModalOpen}
        onClose={() => setIsFrequencyModalOpen(false)}
        title="운동 일정 설정"
      >
        <div className="space-y-6 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기간 (주)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-md p-2 text-center"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
              />
              <span className="text-gray-500 w-10">주간</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주당 횟수
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="7"
                className="w-full border border-gray-300 rounded-md p-2 text-center"
                value={frequencyPerWeek}
                onChange={(e) => setFrequencyPerWeek(Number(e.target.value))}
              />
              <span className="text-gray-500 w-10">회</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsFrequencyModalOpen(false)}
          className="w-full h-[42px] rounded-lg bg-main text-white font-semibold"
        >
          확인
        </button>
      </Modal>
    </div>
  );
};

export default ProgramAddPage;
