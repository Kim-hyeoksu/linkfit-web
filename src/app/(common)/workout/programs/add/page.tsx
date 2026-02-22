"use client";

import { Header, Modal, useToast } from "@/shared";
import { useState, useEffect } from "react";
import { ExerciseList, type Exercise, getExercises } from "@/entities/exercise";
import {
  ChevronRight,
  PlusCircle,
  Calendar,
  Settings2,
  Check,
  ArrowRight,
  Info,
  X,
} from "lucide-react";

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
  const { showToast } = useToast();
  const [programTitle, setProgramTitle] = useState("");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [frequencyPerWeek, setFrequencyPerWeek] = useState(3);

  // 임시 설정을 저장할 State 추가
  const [tempDuration, setTempDuration] = useState(4);
  const [tempFrequency, setTempFrequency] = useState(3);

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

  // 모달을 열 때 현재 값을 임시 값에 복사
  const handleOpenFrequencyModal = () => {
    setTempDuration(durationWeeks);
    setTempFrequency(frequencyPerWeek);
    setIsFrequencyModalOpen(true);
  };

  const handleConfirmFrequency = () => {
    if (tempDuration <= 0 || tempFrequency <= 0) {
      showToast(
        "진행 기간과 주당 횟수는 반드시 1 이상의 숫자를 입력해야 합니다.",
        "error",
      );
      return;
    }

    // 확정 버튼을 눌렀을 때만 실제 State에 반영
    setDurationWeeks(tempDuration);
    setFrequencyPerWeek(tempFrequency);
    setIsFrequencyModalOpen(false);
    setIsConfigured(true);

    const newPlans: ProgramPlan[] = [];
    let dayOrderCounter = 1;
    for (let w = 1; w <= tempDuration; w++) {
      for (let d = 1; d <= tempFrequency; d++) {
        newPlans.push({
          week: w,
          day: d,
          dayOrder: dayOrderCounter++,
          title: `${w}주차 ${d}일차`,
          weekDay: 1,
          description: "",
          exercises: [],
        });
      }
    }
    setPlans(newPlans);

    if (currentWeek > tempDuration) {
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
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen pb-20">
      <Header title="프로그램 생성" showBackButton={true}>
        {isConfigured && (
          <button
            disabled={!programTitle}
            className={`font-bold text-[14px] px-3 py-1.5 rounded-xl transition-all ${
              programTitle
                ? "text-main bg-blue-50 active:scale-95"
                : "text-slate-300 bg-slate-100 cursor-not-allowed"
            }`}
          >
            저장
          </button>
        )}
      </Header>

      <div className="px-5 pt-6 flex flex-col gap-8">
        {/* 프로그램 기본 정보 */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5 px-1">
            <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
              프로그램 정보
            </label>
            <input
              type="text"
              placeholder="프로그램 이름을 입력하세요"
              value={programTitle}
              onChange={(e) => setProgramTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-[16px] font-bold text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all shadow-sm"
            />
          </div>

          <div
            onClick={handleOpenFrequencyModal}
            className="group bg-white border border-slate-200 rounded-2xl p-5 flex justify-between items-center cursor-pointer hover:border-main/30 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-main group-hover:bg-main group-hover:text-white transition-colors">
                <Calendar size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-slate-800">
                  운동 일정 설정
                </span>
                <span className="text-[13px] text-slate-400 font-medium font-outfit">
                  {isConfigured
                    ? `${durationWeeks} W • ${frequencyPerWeek} D/W`
                    : "일정을 설정하고 플랜을 구성하세요"}
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-main group-hover:bg-blue-50 transition-colors">
              <Settings2 size={18} />
            </div>
          </div>
        </section>

        {/* 주차별 플랜 구성 */}
        {isConfigured && (
          <section className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-1">
              <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                주차별 플랜 구성
              </label>
              <span className="text-[11px] font-bold bg-blue-50 text-main px-2 py-0.5 rounded-full">
                {currentWeek} / {durationWeeks} Weeks
              </span>
            </div>

            {/* 주차 선택 탭 */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide -mx-5 px-5">
              {Array.from({ length: durationWeeks }, (_, index) => {
                const week = index + 1;
                const isActive = week === currentWeek;
                return (
                  <button
                    key={week}
                    onClick={() => setCurrentWeek(week)}
                    className={`h-11 px-5 rounded-2xl text-[14px] font-bold whitespace-nowrap border transition-all ${
                      isActive
                        ? "bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200"
                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
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
                .map((plan) => {
                  const hasExercises = plan.exercises.length > 0;
                  return (
                    <div
                      key={plan.dayOrder}
                      onClick={() => handlePlanItemClick(plan)}
                      className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-main/20 hover:shadow-md transition-all active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-[14px] ${
                            hasExercises
                              ? "bg-blue-100 text-main"
                              : "bg-slate-50 text-slate-300"
                          }`}
                        >
                          D{plan.day}
                        </div>
                        <div className="flex flex-col">
                          <h4 className="font-bold text-slate-800 text-[16px]">
                            {plan.title || `${plan.day}일차 운동`}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            {hasExercises ? (
                              <span className="text-[12px] font-bold text-main">
                                {plan.exercises.length}개의 운동 포함
                              </span>
                            ) : (
                              <span className="text-[12px] font-medium text-slate-300 italic">
                                계획을 구성해주세요
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-main transition-colors">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}
      </div>

      {/* 빈도 설정 모달 */}
      <Modal
        isOpen={isFrequencyModalOpen}
        onClose={() => setIsFrequencyModalOpen(false)}
        title="운동 일정 설정"
      >
        <div className="flex flex-col gap-8 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                진행 기간
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={tempDuration || ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > 0) setTempDuration(val);
                    else if (e.target.value === "") setTempDuration(0);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pr-12 text-center text-[18px] font-bold text-slate-800 focus:ring-2 focus:ring-main/20 focus:bg-white outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[14px]">
                  Weeks
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                주당 횟수
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={tempFrequency || ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > 0) setTempFrequency(val);
                    else if (e.target.value === "") setTempFrequency(0);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pr-12 text-center text-[18px] font-bold text-slate-800 focus:ring-2 focus:ring-main/20 focus:bg-white outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[14px]">
                  Days
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
            <Info size={18} className="text-main mt-0.5 flex-shrink-0" />
            <p className="text-[13px] text-blue-700 leading-relaxed font-medium">
              설정하신 {tempDuration}주 동안 매주 {tempFrequency}번의 운동
              플랜을 구성하게 됩니다. 설정 완료 시 기존 계획이 초기화될 수
              있습니다.
            </p>
          </div>

          <button
            onClick={handleConfirmFrequency}
            className="w-full h-[60px] rounded-2xl bg-main text-white font-bold text-[16px] shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            일정 확정하기
          </button>
        </div>
      </Modal>

      {/* 플랜 편집 모달 */}
      {editingPlan && (
        <Modal
          isOpen={!!editingPlan}
          onClose={() => setEditingPlan(null)}
          title={step === 1 ? "플랜 정보 수정" : "운동 구성"}
        >
          <div className="flex flex-col gap-6">
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all ${step === 1 ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}
              >
                기본 정보
              </button>
              <button
                onClick={() => setStep(2)}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all ${step === 2 ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}
              >
                운동 목록
              </button>
            </div>

            {step === 1 ? (
              <div className="flex flex-col gap-6 py-2">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[13px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                    플랜 제목
                  </label>
                  <input
                    type="text"
                    value={editingPlan.title}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, title: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[15px] font-bold text-slate-800 focus:ring-2 focus:ring-main/20 focus:bg-white outline-none transition-all"
                    placeholder="운동 이름을 입력하세요 (예: 가슴 폭발)"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-[13px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                    주요 요일
                  </label>
                  <div className="grid grid-cols-7 gap-1.5">
                    {weekDays.map((day, index) => {
                      const isSelected = editingPlan.weekDay === index + 1;
                      return (
                        <button
                          key={day}
                          onClick={() =>
                            setEditingPlan({
                              ...editingPlan,
                              weekDay: index + 1,
                            })
                          }
                          className={`h-11 rounded-xl text-[13px] font-bold transition-all border ${
                            isSelected
                              ? "bg-main text-white border-main shadow-md shadow-blue-500/20"
                              : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-[13px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                    메모 (선택)
                  </label>
                  <textarea
                    value={editingPlan.description}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[15px] font-medium text-slate-800 focus:ring-2 focus:ring-main/20 focus:bg-white outline-none transition-all h-24 resize-none"
                    placeholder="이날 운동에 대한 팁을 적어주세요"
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full h-[56px] rounded-2xl bg-slate-800 text-white font-bold text-[15px] mt-4 shadow-lg shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  운동 구성하러 가기
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5 py-2">
                <button
                  onClick={() => setIsExerciseSelectorOpen(true)}
                  className="w-full py-6 border-2 border-dashed border-slate-200 rounded-3xl text-slate-300 font-bold hover:border-main/40 hover:text-main hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-main transition-all">
                    <PlusCircle size={24} />
                  </div>
                  운동 추가하기
                </button>

                <div className="max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                  {editingPlan.exercises.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {editingPlan.exercises.map((e, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[12px] font-bold text-slate-400">
                            {idx + 1}
                          </div>
                          <div className="flex flex-col grow">
                            <span className="text-[14px] font-bold text-slate-800">
                              {e.name}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                              {e.bodyPart}
                            </span>
                          </div>
                          <button
                            className="p-2 text-slate-300 hover:text-red-400 transition-colors"
                            onClick={(event) => {
                              event.stopPropagation();
                              const newExercises = editingPlan.exercises.filter(
                                (_, i) => i !== idx,
                              );
                              setEditingPlan({
                                ...editingPlan,
                                exercises: newExercises,
                              });
                            }}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                      <p className="text-[13px] font-medium">
                        아직 등록된 운동이 없습니다.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5 mt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 h-[56px] rounded-2xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-all"
                  >
                    이전
                  </button>
                  <button
                    onClick={handleSavePlan}
                    className="flex-[2] h-[56px] rounded-2xl bg-main text-white font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
                  >
                    플랜 저장하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* 운동 선택 모달 */}
      <Modal
        isOpen={isExerciseSelectorOpen}
        onClose={() => setIsExerciseSelectorOpen(false)}
        title="운동 검색 및 선택"
      >
        <div className="h-[65vh] flex flex-col -mx-1">
          <div className="h-full overflow-y-auto pr-1 scrollbar-hide">
            <ExerciseList
              exercises={availableExercises}
              onSelect={handleAddExercise}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProgramAddPage;
