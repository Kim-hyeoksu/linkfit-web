"use client";
import { Header, Modal } from "@/shared";
import { useState } from "react";

const ProgramAddPage = () => {
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [frequencyPerWeek, setFrequencyPerWeek] = useState(3);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isConfigured, setIsConfigured] = useState(false);

  const handleConfirmFrequency = () => {
    setIsFrequencyModalOpen(false);
    setIsConfigured(true);
    // 기간이 줄어들어 현재 주차가 범위를 벗어날 경우 1주차로 초기화
    if (currentWeek > durationWeeks) {
      setCurrentWeek(1);
    }
  };

  return (
    <div className=" flex flex-col gap-2 bg-[#F7F8F9] min-h-screen">
      <Header title="새로운 루틴">
        {isConfigured && (
          <button className="text-blue-500 font-bold text-sm">저장</button>
        )}
      </Header>
      <div className="p-5 flex flex-col gap-4">
        {/* 운동 일정 설정 버튼 (요약 정보) */}
        <div
          onClick={() => setIsFrequencyModalOpen(true)}
          className="border border-[#e5e5e5] rounded-lg p-4 flex justify-between items-center cursor-pointer bg-white"
        >
          <span className="font-bold text-gray-700">운동 일정</span>
          <span className="text-blue-500 font-medium">
            {durationWeeks}주간 주 {frequencyPerWeek}회
          </span>
        </div>

        {/* 설정 완료 후에만 주차별 UI 표시 */}
        {isConfigured && (
          <>
            {/* 주차 탭 */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {Array.from({ length: durationWeeks }, (_, index) => {
                const week = index + 1;
                return (
                  <button
                    key={week}
                    onClick={() => setCurrentWeek(week)}
                    className={`px-3 py-1 rounded-lg border text-sm whitespace-nowrap transition-colors ${
                      week === currentWeek
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {week}주차
                  </button>
                );
              })}
            </div>

            {/* 일차별 리스트 */}
            <div className="flex flex-col gap-3">
              {Array.from({ length: frequencyPerWeek }, (_, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-[#e5e5e5] shadow-sm flex justify-between items-center cursor-pointer hover:border-blue-300 transition-colors"
                >
                  <div>
                    <div className="font-bold text-gray-900">
                      {currentWeek}주차 {index + 1}일차
                    </div>
                    <div className="text-sm text-gray-500">
                      운동 계획을 구성해보세요
                    </div>
                  </div>
                  <div className="text-gray-400">&gt;</div>
                </div>
              ))}
            </div>
          </>
        )}
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
          onClick={handleConfirmFrequency}
          className="w-full h-[42px] rounded-lg bg-main text-white font-semibold"
        >
          확인
        </button>
      </Modal>
    </div>
  );
};

export default ProgramAddPage;
