"use client";

import { Header, Modal, useToast } from "@/shared";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { userState } from "@/entities/user/model/userState";
import { useAddProgram } from "@/features/program/add-program";
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
  Minus,
  Trash2,
  Copy,
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
  weekNumber: number;
  day: number;
  dayOrder: number;
  title: string;
  description: string;
  exercises: ProgramPlanExercise[];
}

const ProgramAddPage = () => {
  const user = useAtomValue(userState);
  const { showToast } = useToast();
  const router = useRouter();
  const [programTitle, setProgramTitle] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [programLevel, setProgramLevel] = useState<
    "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | ""
  >("");
  const [programCategory, setProgramCategory] = useState<number>(0);

  const [durationWeeks, setDurationWeeks] = useState(4);
  const [frequencyPerWeek, setFrequencyPerWeek] = useState(3);

  // 임시 설정을 저장할 State 추가
  const [tempDuration, setTempDuration] = useState(4);
  const [tempFrequency, setTempFrequency] = useState(3);

  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isConfigured, setIsConfigured] = useState(false);
  const [plans, setPlans] = useState<ProgramPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<ProgramPlan | null>(null);
  const [step, setStep] = useState(1);
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [focusedField, setFocusedField] = useState<{
    index: number;
    setIndex?: number;
    field: string;
  } | null>(null);

  const { handleAddProgram, loading } = useAddProgram();

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
          weekNumber: w,
          day: d,
          dayOrder: dayOrderCounter++,
          title: `${w}주차 ${d}일차`,
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

    let hasInvalid = false;
    for (const ex of editingPlan.exercises) {
      if (ex.defaultRestSeconds < 0) {
        showToast("휴식 시간은 0초 이상이어야 합니다.", "error");
        hasInvalid = true;
        break;
      }
      for (const set of ex.sets) {
        if (set.reps <= 0) {
          showToast("반복 횟수(REPS)는 최소 1 이상이어야 합니다.", "error");
          hasInvalid = true;
          break;
        }
        if (set.weight <= 0) {
          showToast("무게(WEIGHT)는 0 초과이어야 합니다.", "error");
          hasInvalid = true;
          break;
        }
      }
      if (hasInvalid) break;
    }

    if (hasInvalid) return;

    setPlans((prevPlans) =>
      prevPlans.map((p) =>
        p.dayOrder === editingPlan.dayOrder ? editingPlan : p,
      ),
    );
    setEditingPlan(null);
  };

  const handleCopyPlan = (sourcePlan: ProgramPlan) => {
    if (!editingPlan) return;

    // Deep copy exercises
    const copiedExercises = sourcePlan.exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((set) => ({ ...set })),
    }));

    setEditingPlan({
      ...editingPlan,
      exercises: copiedExercises,
    });
    setIsCopyModalOpen(false);
    showToast(
      `${sourcePlan.weekNumber}주차 ${sourcePlan.day}일차 운동을 불러왔습니다.`,
    );
  };

  const handleCreateProgram = async () => {
    if (loading) return;
    if (!programTitle) {
      showToast("프로그램 이름을 입력해주세요.", "error");
      return;
    }

    if (!isConfigured || plans.length === 0) {
      showToast("운동 일정을 먼저 설정해주세요.", "error");
      return;
    }

    try {
      // 1. 데이터 형식 변환 (API 스펙에 맞게)
      const mappedPlans = plans.map((p) => ({
        title: p.title || `${p.weekNumber}주차 ${p.day}일차`,
        dayOrder: p.dayOrder,
        weekNumber: p.weekNumber,
        description: p.description,
        exercises: p.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          orderIndex: ex.orderIndex,
          defaultSets: ex.sets.length,
          defaultReps: ex.sets[0]?.reps || 10,
          defaultWeight: ex.sets[0]?.weight || 0,
          defaultRestSeconds: ex.defaultRestSeconds,
          sets: ex.sets.map((s) => ({
            setOrder: s.setOrder,
            reps: s.reps,
            weight: s.weight,
            restSeconds: s.restSeconds,
          })),
        })),
      }));

      const requestData = {
        categoryId: programCategory || 1, // 미선택시 기본값 1
        programName: programTitle,
        description: programDescription,
        level: (programLevel as any) || "BEGINNER",
        programType: "PERSONAL" as const,
        status: "DRAFT" as const,
        plans: mappedPlans,
      };

      // 2. API 호출
      await handleAddProgram(requestData);

      showToast("프로그램이 성공적으로 생성되었습니다!");
      // 3. 목록 페이지로 이동
      router.push("/workout/programs/mine");
    } catch (error) {
      console.error("프로그램 생성 실패:", error);
      showToast("프로그램 생성 중 오류가 발생했습니다.", "error");
    }
  };

  const handlePlanItemClick = (plan: ProgramPlan) => {
    setStep(1);
    setEditingPlan(plan);
  };

  const handleAddExercise = (exercise: Exercise) => {
    if (!editingPlan) return;
    const defaultSetsCount = exercise.defaultSets || 3;
    const defaultReps = exercise.defaultReps || 10;
    const defaultWeight = exercise.defaultWeight || 0;
    const defaultRestSeconds = exercise.defaultRestSeconds || 60;

    const newExercise: ProgramPlanExercise = {
      exerciseId: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      orderIndex: editingPlan.exercises.length + 1,
      defaultSets: defaultSetsCount,
      defaultReps: defaultReps,
      defaultWeight: defaultWeight,
      defaultRestSeconds: defaultRestSeconds,
      sets: Array.from({ length: defaultSetsCount }, (_, i) => ({
        setOrder: i + 1,
        reps: defaultReps,
        weight: defaultWeight,
        restSeconds: defaultRestSeconds,
      })),
    };
    setEditingPlan({
      ...editingPlan,
      exercises: [...editingPlan.exercises, newExercise],
    });
    setIsExerciseSelectorOpen(false);
  };

  const handleUpdateExercise = (
    index: number,
    field: keyof ProgramPlanExercise,
    value: number,
  ) => {
    if (!editingPlan) return;
    const safeValue = value < 0 ? 0 : value;
    setEditingPlan({
      ...editingPlan,
      exercises: editingPlan.exercises.map((ex, i) =>
        i === index ? { ...ex, [field]: safeValue } : ex,
      ),
    });
  };

  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ProgramPlanSet,
    value: number,
  ) => {
    if (!editingPlan) return;
    const safeValue = value < 0 ? 0 : value;
    setEditingPlan({
      ...editingPlan,
      exercises: editingPlan.exercises.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        const newSets = ex.sets.map((s, si) =>
          si === setIndex ? { ...s, [field]: safeValue } : s,
        );
        return { ...ex, sets: newSets };
      }),
    });
  };

  const handleAddSet = (exerciseIndex: number) => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      exercises: editingPlan.exercises.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        const lastSet = ex.sets[ex.sets.length - 1] || {
          setOrder: 1,
          reps: ex.defaultReps,
          weight: ex.defaultWeight,
          restSeconds: ex.defaultRestSeconds,
        };
        return {
          ...ex,
          sets: [...ex.sets, { ...lastSet, setOrder: ex.sets.length + 1 }],
        };
      }),
    });
  };

  const handleDeleteSet = (exerciseIndex: number, setIndex: number) => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      exercises: editingPlan.exercises.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        const newSets = ex.sets
          .filter((_, si) => si !== setIndex)
          .map((s, idx) => ({ ...s, setOrder: idx + 1 }));
        return {
          ...ex,
          sets: newSets,
        };
      }),
    });
  };

  const handleRemoveExercise = (index: number) => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      exercises: editingPlan.exercises.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen pb-20">
      <Header title="프로그램 생성" showBackButton={true}>
        {isConfigured && (
          <button
            disabled={!programTitle || loading}
            onClick={handleCreateProgram}
            className={`font-bold text-[14px] px-3 py-1.5 rounded-xl transition-all ${
              programTitle && !loading
                ? "text-main bg-blue-50 active:scale-95"
                : "text-slate-300 bg-slate-100 cursor-not-allowed"
            }`}
          >
            {loading ? "저장 중..." : "저장"}
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
            <textarea
              placeholder="프로그램에 대한 간단한 설명을 적어주세요"
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-[15px] font-medium text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all shadow-sm h-24 resize-none mt-2"
            />

            {user?.userType === "TRAINER" && (
              <div className="flex flex-col gap-2.5 mt-2">
                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                  난이도 설정
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "BEGINNER", label: "초급" },
                    { value: "INTERMEDIATE", label: "중급" },
                    { value: "ADVANCED", label: "고급" },
                  ].map((level) => {
                    const isSelected = programLevel === level.value;
                    return (
                      <button
                        key={level.value}
                        onClick={() => setProgramLevel(level.value as any)}
                        className={`flex-1 h-11 rounded-xl text-[14px] font-bold transition-all border ${
                          isSelected
                            ? "bg-slate-800 text-white border-slate-800 shadow-md"
                            : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {level.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2.5 mt-2">
              <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                카테고리 목적
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {[
                  { id: 1, label: "다이어트" },
                  { id: 2, label: "벌크업" },
                  { id: 3, label: "체력증진" },
                  { id: 4, label: "재활/교정" },
                  { id: 5, label: "스트렝스" },
                ].map((cat) => {
                  const isSelected = programCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setProgramCategory(cat.id)}
                      className={`whitespace-nowrap px-4 h-11 rounded-xl text-[14px] font-bold transition-all border ${
                        isSelected
                          ? "bg-main text-white border-main shadow-md shadow-blue-500/20"
                          : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
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
                .filter((plan) => plan.weekNumber === currentWeek)
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

                <div className="pt-2 mt-2 border-t border-slate-100 flex flex-col gap-3">
                  <label className="text-[13px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                    편의 기능
                  </label>
                  <button
                    onClick={() => setIsCopyModalOpen(true)}
                    className="w-full h-[52px] bg-blue-50 text-main border border-blue-100 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                  >
                    <Copy size={18} />
                    기존 구성 불러오기 (복사)
                  </button>
                  <p className="text-[11px] text-slate-400 text-center px-2">
                    다른 날짜에 구성해둔 플랜 목록을 그대로 복사합니다.
                  </p>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full h-[56px] rounded-2xl bg-slate-800 text-white font-bold text-[15px] mt-2 shadow-lg shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
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

                <div className="max-h-[500px] overflow-y-auto pr-1 scrollbar-hide py-2">
                  {editingPlan.exercises.length > 0 ? (
                    <div className="flex flex-col gap-5">
                      {editingPlan.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-4 relative"
                        >
                          <button
                            onClick={() => handleRemoveExercise(index)}
                            className="absolute top-5 right-5 text-slate-300 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 size={20} />
                          </button>

                          <div className="pr-10">
                            <h3 className="text-[16px] font-extrabold text-slate-800">
                              {exercise.name}
                            </h3>
                            <div className="flex gap-2 items-center mt-1">
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 uppercase">
                                {exercise.bodyPart}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-main uppercase">
                                {exercise.sets.length} SETS
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 mt-2">
                            {/* Header for sets */}
                            <div className="grid grid-cols-12 gap-2 text-[10px] text-slate-400 font-black px-3 uppercase tracking-wider">
                              <div className="col-span-1"></div>
                              <div className="col-span-2 text-center">SET</div>
                              <div className="col-span-4 text-center">
                                WEIGHT (kg)
                              </div>
                              <div className="col-span-4 text-center">
                                REPS (회)
                              </div>
                              <div className="col-span-1"></div>
                            </div>

                            <div className="flex flex-col gap-2">
                              {exercise.sets.map((set, setIndex) => (
                                <div
                                  key={setIndex}
                                  className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-[16px] bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                                >
                                  <div className="col-span-1"></div>
                                  <div className="col-span-2 text-center text-sm font-black text-slate-700">
                                    {setIndex + 1}
                                  </div>

                                  <div className="col-span-4 flex justify-center">
                                    <input
                                      type="number"
                                      className="w-16 h-8 bg-white border border-slate-200 text-center rounded-md font-bold focus:ring-2 focus:ring-blue-100 outline-none text-[13px]"
                                      value={
                                        focusedField?.index === index &&
                                        focusedField?.setIndex === setIndex &&
                                        focusedField?.field === "weight" &&
                                        set.weight === 0
                                          ? ""
                                          : set.weight
                                      }
                                      onFocus={() =>
                                        setFocusedField({
                                          index,
                                          setIndex,
                                          field: "weight",
                                        })
                                      }
                                      onBlur={() => setFocusedField(null)}
                                      onChange={(e) =>
                                        handleUpdateSet(
                                          index,
                                          setIndex,
                                          "weight",
                                          Number(e.target.value),
                                        )
                                      }
                                    />
                                  </div>

                                  <div className="col-span-4 flex justify-center">
                                    <input
                                      type="number"
                                      className="w-16 h-8 bg-white border border-slate-200 text-center rounded-md font-bold focus:ring-2 focus:ring-blue-100 outline-none text-[13px]"
                                      value={
                                        focusedField?.index === index &&
                                        focusedField?.setIndex === setIndex &&
                                        focusedField?.field === "reps" &&
                                        set.reps === 0
                                          ? ""
                                          : set.reps
                                      }
                                      onFocus={() =>
                                        setFocusedField({
                                          index,
                                          setIndex,
                                          field: "reps",
                                        })
                                      }
                                      onBlur={() => setFocusedField(null)}
                                      onChange={(e) =>
                                        handleUpdateSet(
                                          index,
                                          setIndex,
                                          "reps",
                                          Number(e.target.value),
                                        )
                                      }
                                    />
                                  </div>

                                  <div className="col-span-1 flex justify-center">
                                    <button
                                      onClick={() =>
                                        handleDeleteSet(index, setIndex)
                                      }
                                      className="p-1 text-slate-300 hover:text-red-400 transition-colors"
                                    >
                                      <Minus size={14} strokeWidth={3} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => handleAddSet(index)}
                              className="w-full mt-2 py-3 border border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-[12px] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            >
                              <PlusCircle size={14} />
                              세트 추가하기
                            </button>
                          </div>

                          {/* Rest Seconds setting for the exercise */}
                          <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[12px] font-bold text-slate-400">
                              휴식 시간 (초)
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                step="10"
                                className="w-16 h-8 bg-slate-50 border border-slate-200 text-center rounded-md font-bold text-[12px] focus:ring-2 focus:ring-blue-100 outline-none"
                                value={
                                  focusedField?.index === index &&
                                  focusedField?.field ===
                                    "defaultRestSeconds" &&
                                  exercise.defaultRestSeconds === 0
                                    ? ""
                                    : exercise.defaultRestSeconds
                                }
                                onFocus={() =>
                                  setFocusedField({
                                    index,
                                    field: "defaultRestSeconds",
                                  })
                                }
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) =>
                                  handleUpdateExercise(
                                    index,
                                    "defaultRestSeconds",
                                    Number(e.target.value),
                                  )
                                }
                              />
                              <span className="text-[10px] font-bold text-slate-400">
                                SEC
                              </span>
                            </div>
                          </div>
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

      {/* 플랜 복사 모달 */}
      <Modal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        title="기존 구성 불러오기"
      >
        <div className="flex flex-col gap-4 py-2">
          {editingPlan && (
            <p className="text-[13px] text-slate-500 font-medium px-1">
              현재{" "}
              <span className="font-bold text-slate-800">
                {editingPlan.weekNumber}주차 {editingPlan.day}일차
              </span>
              에 덮어씌울 플랜을 선택해주세요.
            </p>
          )}
          <div className="max-h-[400px] overflow-y-auto scrollbar-hide flex flex-col gap-3">
            {editingPlan &&
            plans.filter(
              (p) =>
                p.exercises.length > 0 && p.dayOrder !== editingPlan.dayOrder,
            ).length > 0 ? (
              plans
                .filter(
                  (p) =>
                    p.exercises.length > 0 &&
                    p.dayOrder !== editingPlan.dayOrder,
                )
                .map((p) => (
                  <button
                    key={p.dayOrder}
                    onClick={() => handleCopyPlan(p)}
                    className="flex flex-col text-left p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-main focus:ring-2 focus:ring-main/20 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-[12px] bg-slate-50 flex flex-col items-center justify-center text-slate-400 flex-shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider -mb-0.5">
                          W{p.weekNumber}
                        </span>
                        <span className="text-[14px] font-black text-slate-700">
                          {p.day}
                        </span>
                      </div>
                      <div className="flex flex-col flex-1 truncate">
                        <span className="text-[15px] font-bold text-slate-800 truncate">
                          {p.title || `${p.weekNumber}주차 ${p.day}일차 운동`}
                        </span>
                        <span className="text-[13px] text-slate-400 font-medium mt-0.5">
                          총 {p.exercises.length}개의 운동 •{" "}
                          {p.exercises.reduce(
                            (acc, ex) => acc + ex.sets.length,
                            0,
                          )}{" "}
                          세트
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-main flex items-center justify-center flex-shrink-0">
                        <Copy size={16} />
                      </div>
                    </div>
                  </button>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <span className="text-[13px] font-medium">
                  복사할 수 있는 기존 플랜이 없습니다.
                </span>
                <span className="text-[11px] mt-1">
                  먼저 다른 플랜에 운동을 추가해주세요.
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCopyModalOpen(false)}
            className="w-full h-[56px] rounded-2xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-all mt-2"
          >
            취소
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProgramAddPage;
