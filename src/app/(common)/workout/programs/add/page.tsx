"use client";
import { Header, Modal } from "@/shared";
import { useState, useEffect } from "react";
import { ExerciseList, type Exercise, getExercises } from "@/entities/exercise";
import { ChevronRight, PlusCircle } from "lucide-react";

interface ProgramPlanSet {
  setOrder: number;
  reps: number;
  weight: number;
  restSeconds: number;
}

interface ProgramPlanExercise {
  exerciseId: number;
  name: string;
  bodyPart: string;
  orderIndex: number;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number;
  defaultRestSeconds: number;
  sets: ProgramPlanSet[];
}

interface ProgramPlan {
  week: number;
  day: number;
  dayOrder: number;
  title: string;
  weekDay: number; // 1: 월요일 ~ 7: 일요일
  description: string;
  exercises: ProgramPlanExercise[];
}

const ProgramAddPage = () => {
  const [durationWeeks, setDurationWeeks] = useState(0);
  const [frequencyPerWeek, setFrequencyPerWeek] = useState(0);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isConfigured, setIsConfigured] = useState(false);
  const [plans, setPlans] = useState<ProgramPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<ProgramPlan | null>(null);
  const [step, setStep] = useState(1);
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);

  const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await getExercises();
        setAvailableExercises(data);
      } catch (error) {
        console.error("운동 목록 조회 실패:", error);
      }
    };

    loadExercises();
  }, []);

  const handleConfirmFrequency = () => {
    setIsFrequencyModalOpen(false);
    setIsConfigured(true);

    // 설정된 기간과 빈도에 맞춰 플랜 데이터 초기화
    const newPlans: ProgramPlan[] = [];
    let dayOrderCounter = 1;
    for (let w = 1; w <= durationWeeks; w++) {
      for (let d = 1; d <= frequencyPerWeek; d++) {
        newPlans.push({
          week: w,
          day: d,
          dayOrder: dayOrderCounter++,
          title: `${w}주차 ${d}일차`,
          weekDay: 1, // 기본값 (월요일)
          description: "",
          exercises: [],
        });
      }
    }
    setPlans(newPlans);

    // 기간이 줄어들어 현재 주차가 범위를 벗어날 경우 1주차로 초기화
    if (currentWeek > durationWeeks) {
      setCurrentWeek(1);
    }
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;
    setPlans((prevPlans) =>
      prevPlans.map((p) =>
        p.dayOrder === editingPlan.dayOrder ? editingPlan : p,
      ),
    );
    setEditingPlan(null);
  };

  const handlePlanItemClick = (plan: ProgramPlan) => {
    setStep(1);
    setEditingPlan(plan);
  };

  const handleAddExercise = (exercise: Exercise) => {
    if (!editingPlan) return;
    const newExercise: ProgramPlanExercise = {
      exerciseId: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      orderIndex: editingPlan.exercises.length + 1,
      defaultSets: 3,
      defaultReps: 10,
      defaultWeight: 20,
      defaultRestSeconds: 60,
      sets: [],
    };
    setEditingPlan({
      ...editingPlan,
      exercises: [...editingPlan.exercises, newExercise],
    });
    setIsExerciseSelectorOpen(false);
  };

  return (
    <div className=" flex flex-col gap-2 bg-[#F7F8F9] min-h-screen pb-20">
      <Header title="새로운 루틴">
        {isConfigured && (
          <button className="text-blue-500 font-bold text-sm">저장</button>
        )}
      </Header>
      <div className="p-5 flex flex-col gap-4">
        {/* 운동 일정 설정 버튼 (요약 정보) */}
        <div
          onClick={() => setIsFrequencyModalOpen(true)}
          className="border border-[#e5e5e5] rounded-xl p-4 flex justify-between items-center cursor-pointer bg-white shadow-sm"
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
                    className={`px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all ${
                      week === currentWeek
                        ? "bg-main text-white border-main shadow-md shadow-blue-500/20"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {week}주차
                  </button>
                );
              })}
            </div>

            {/* 일차별 리스트 */}
            <div className="flex flex-col gap-3">
              {plans
                .filter((plan) => plan.week === currentWeek)
                .map((plan, index) => (
                  <div
                    onClick={() => handlePlanItemClick(plan)}
                    key={`${plan.week}-${plan.day}`}
                    className="bg-white p-5 rounded-2xl border border-transparent shadow-sm flex justify-between items-center cursor-pointer hover:border-blue-200 transition-all active:scale-[0.98]"
                  >
                    <div>
                      <div className="font-bold text-gray-900 text-[16px]">
                        {plan.title}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {plan.description || "운동 계획을 구성해보세요"}
                      </div>
                    </div>
                    <ChevronRight className="text-gray-300" size={20} />
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
                className="w-full border border-gray-300 rounded-lg p-3 text-center focus:ring-2 focus:ring-main focus:border-transparent outline-none transition-all"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
              />
              <span className="text-gray-500 w-10 font-medium">주간</span>
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
                className="w-full border border-gray-300 rounded-lg p-3 text-center focus:ring-2 focus:ring-main focus:border-transparent outline-none transition-all"
                value={frequencyPerWeek}
                onChange={(e) => setFrequencyPerWeek(Number(e.target.value))}
              />
              <span className="text-gray-500 w-10 font-medium">회</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleConfirmFrequency}
          className="w-full h-[52px] rounded-xl bg-main text-white font-bold text-[16px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all mt-4"
        >
          설정 완료
        </button>
      </Modal>

      {/* 플랜 편집 모달 */}
      {editingPlan && (
        <Modal
          isOpen={!!editingPlan}
          onClose={() => setEditingPlan(null)}
          title="플랜 편집"
        >
          {step === 1 ? (
            <>
              <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
                {/* 플랜 제목 */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    플랜 제목
                  </label>
                  <input
                    type="text"
                    value={editingPlan.title}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, title: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-main outline-none transition-all"
                    placeholder="예: 가슴 운동하는 날"
                  />
                </div>

                {/* 요일 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    요일
                  </label>
                  <select
                    value={editingPlan.weekDay}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        weekDay: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-main outline-none transition-all appearance-none bg-white"
                  >
                    {weekDays.map((day, index) => (
                      <option key={day} value={index + 1}>
                        {day}요일
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setEditingPlan(null)}
                  className="flex-1 h-[52px] rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 h-[52px] rounded-xl bg-main text-white font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                  다음
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                <button
                  onClick={() => setIsExerciseSelectorOpen(true)}
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-main hover:text-main hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle size={20} />
                  운동 추가하기
                </button>
                <div className="min-h-[100px]">
                  <ExerciseList
                    exercises={editingPlan.exercises.map((e) => ({
                      id: e.exerciseId,
                      name: e.name,
                      bodyPart: e.bodyPart,
                    }))}
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 h-[52px] rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                >
                  이전
                </button>
                <button
                  onClick={handleSavePlan}
                  className="flex-1 h-[52px] rounded-xl bg-main text-white font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                  저장
                </button>
              </div>
            </>
          )}
        </Modal>
      )}

      {/* 운동 선택 모달 */}
      <Modal
        isOpen={isExerciseSelectorOpen}
        onClose={() => setIsExerciseSelectorOpen(false)}
        title="운동 선택"
      >
        <div className="h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
          <ExerciseList
            exercises={availableExercises}
            onSelect={handleAddExercise}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProgramAddPage;
