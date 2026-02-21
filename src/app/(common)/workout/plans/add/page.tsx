"use client";
import { Header, Modal } from "@/shared";
import { useState, useEffect } from "react";
import { ExerciseList, type Exercise, getExercises } from "@/entities/exercise";
import { PlusCircle, Trash2, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createStandalonePlan } from "@/entities/plan/api";
import { useToast } from "@/shared/ui/toast";

interface PlanSet {
  weight: number;
  reps: number;
}

interface PlanExercise {
  exerciseId: number;
  name: string;
  bodyPart: string;
  orderIndex: number;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number;
  defaultRestSeconds: number;
  sets: PlanSet[];
}

const PlanAddPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<PlanExercise[]>([]);
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);

  const router = useRouter();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<{
    index: number;
    setIndex?: number;
    field: string;
  } | null>(null);

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

  const handleAddExercise = (exercise: Exercise) => {
    const defaultSetsCount = exercise.defaultSets || 3;
    const defaultReps = exercise.defaultReps || 10;
    const defaultWeight = exercise.defaultWeight || 0;

    const newExercise: PlanExercise = {
      exerciseId: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      orderIndex: exercises.length + 1,
      defaultSets: defaultSetsCount,
      defaultReps: defaultReps,
      defaultWeight: defaultWeight,
      defaultRestSeconds: exercise.defaultRestSeconds || 60,
      sets: Array.from({ length: defaultSetsCount }, () => ({
        weight: defaultWeight,
        reps: defaultReps,
      })),
    };
    setExercises([...exercises, newExercise]);
    setIsExerciseSelectorOpen(false);
  };

  const handleUpdateExercise = (
    index: number,
    field: keyof PlanExercise,
    value: number,
  ) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)),
    );
  };

  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof PlanSet,
    value: number,
  ) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        const newSets = ex.sets.map((s, si) =>
          si === setIndex ? { ...s, [field]: value } : s,
        );
        return { ...ex, sets: newSets };
      }),
    );
  };

  const handleAddSet = (exerciseIndex: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        const lastSet = ex.sets[ex.sets.length - 1] || {
          reps: ex.defaultReps,
          weight: ex.defaultWeight,
        };
        return {
          ...ex,
          sets: [...ex.sets, { ...lastSet }],
        };
      }),
    );
  };

  const handleDeleteSet = (exerciseIndex: number, setIndex: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.filter((_, si) => si !== setIndex),
        };
      }),
    );
  };

  const handleRemoveExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSavePlan = async () => {
    if (!title.trim()) {
      showToast("플랜 제목을 입력해주세요.");
      return;
    }
    if (exercises.length === 0) {
      showToast("최소 한 개의 운동을 추가해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      const planData = {
        title,
        description,
        exercises: exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          orderIndex: ex.orderIndex,
          defaultSets: ex.sets.length,
          defaultReps: ex.sets[0]?.reps || ex.defaultReps,
          defaultWeight: ex.sets[0]?.weight || ex.defaultWeight,
          defaultRestSeconds: ex.defaultRestSeconds,
          sets: ex.sets.map((s, si) => ({
            setOrder: si + 1,
            reps: s.reps,
            weight: s.weight,
            restSeconds: ex.defaultRestSeconds,
          })),
        })),
      };

      await createStandalonePlan(planData);
      showToast("나만의 플랜이 저장되었습니다!");
      router.push("/workout/plans");
    } catch (error) {
      console.error("플랜 저장 실패:", error);
      showToast("플랜 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-[#F7F8F9] min-h-screen pb-20">
      <Header title="나만의 플랜 만들기" showBackButton={true}>
        <button
          onClick={handleSavePlan}
          className="text-blue-500 font-bold text-sm hover:text-blue-600 transition-colors"
        >
          저장
        </button>
      </Header>

      <div className="px-5 pt-4 flex flex-col gap-6">
        {/* 플랜 제목 및 설명 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              플랜 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-main outline-none transition-all"
              placeholder="예: 가슴 폭발 루틴"
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              플랜 설명 (선택)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-main outline-none transition-all resize-none h-24"
              placeholder="루틴에 대한 간단한 설명을 적어주세요."
              maxLength={200}
            />
          </div>
        </div>

        {/* 운동 목록 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-700">
              추가된 운동 ({exercises.length})
            </label>
          </div>

          <button
            onClick={() => setIsExerciseSelectorOpen(true)}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-main hover:text-main hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            운동 추가하기
          </button>

          {exercises.length > 0 && (
            <div className="flex flex-col gap-6 mt-2 border-t border-gray-100 pt-6">
              {exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-[24px] border border-gray-200 shadow-sm flex flex-col gap-4 relative"
                >
                  <button
                    onClick={() => handleRemoveExercise(index)}
                    className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="pr-10">
                    <h3 className="text-lg font-extrabold text-[#1e293b]">
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
                      <div className="col-span-4 text-center">WEIGHT (kg)</div>
                      <div className="col-span-4 text-center">REPS (회)</div>
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
                              className="w-16 h-8 bg-white border border-slate-200 text-center rounded-md font-bold focus:ring-2 focus:ring-blue-100 outline-none"
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
                              className="w-16 h-8 bg-white border border-slate-200 text-center rounded-md font-bold focus:ring-2 focus:ring-blue-100 outline-none"
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
                              onClick={() => handleDeleteSet(index, setIndex)}
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
                      className="w-full mt-2 py-3 border border-dashed border-gray-200 rounded-xl text-slate-400 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <PlusCircle size={14} />
                      세트 추가하기
                    </button>
                  </div>

                  {/* Rest Seconds setting for the exercise */}
                  <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      휴식 시간 (초)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="10"
                        className="w-16 h-8 bg-slate-50 border border-slate-200 text-center rounded-md font-bold text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                        value={
                          focusedField?.index === index &&
                          focusedField?.field === "defaultRestSeconds" &&
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
          )}
        </div>
      </div>

      {/* 운동 선택 모달 */}
      <Modal
        isOpen={isExerciseSelectorOpen}
        onClose={() => setIsExerciseSelectorOpen(false)}
        title="운동 선택"
      >
        <div className="h-[60vh] overflow-y-auto pr-2 scrollbar-hide py-2">
          <ExerciseList
            exercises={availableExercises}
            onSelect={handleAddExercise}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PlanAddPage;
