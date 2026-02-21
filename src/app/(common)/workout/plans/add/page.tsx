"use client";
import { Header, Modal } from "@/shared";
import { useState, useEffect } from "react";
import { ExerciseList, type Exercise, getExercises } from "@/entities/exercise";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createStandalonePlan } from "@/entities/plan/api";
import { useToast } from "@/shared/ui/toast";

interface PlanExercise {
  exerciseId: number;
  name: string;
  bodyPart: string;
  orderIndex: number;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number;
  defaultRestSeconds: number;
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
    field: keyof PlanExercise;
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
    const newExercise: PlanExercise = {
      exerciseId: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      orderIndex: exercises.length + 1,
      defaultSets: exercise.defaultSets || 3,
      defaultReps: exercise.defaultReps || 10,
      defaultWeight: exercise.defaultWeight || 0,
      defaultRestSeconds: exercise.defaultRestSeconds || 60,
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
          defaultSets: ex.defaultSets,
          defaultReps: ex.defaultReps,
          defaultWeight: ex.defaultWeight,
          defaultRestSeconds: ex.defaultRestSeconds,
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
            <div className="flex flex-col gap-4 mt-2 border-t border-gray-100 pt-4">
              {exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="bg-[#F7F8F9] p-4 rounded-xl border border-[#e5e5e5] flex flex-col gap-3 relative"
                >
                  <button
                    onClick={() => handleRemoveExercise(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="pr-8">
                    <div className="font-bold text-gray-900">
                      {exercise.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {exercise.bodyPart}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500">
                        세트 (Sets)
                      </label>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 shadow-sm focus-within:ring-2 focus-within:ring-main">
                        <input
                          type="number"
                          min="1"
                          value={
                            focusedField?.index === index &&
                            focusedField?.field === "defaultSets" &&
                            exercise.defaultSets === 0
                              ? ""
                              : exercise.defaultSets
                          }
                          onFocus={() =>
                            setFocusedField({ index, field: "defaultSets" })
                          }
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) =>
                            handleUpdateExercise(
                              index,
                              "defaultSets",
                              Number(e.target.value),
                            )
                          }
                          className="w-full py-2 text-center text-sm font-semibold outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500">
                        횟수 (Reps)
                      </label>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 shadow-sm focus-within:ring-2 focus-within:ring-main">
                        <input
                          type="number"
                          min="1"
                          value={
                            focusedField?.index === index &&
                            focusedField?.field === "defaultReps" &&
                            exercise.defaultReps === 0
                              ? ""
                              : exercise.defaultReps
                          }
                          onFocus={() =>
                            setFocusedField({ index, field: "defaultReps" })
                          }
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) =>
                            handleUpdateExercise(
                              index,
                              "defaultReps",
                              Number(e.target.value),
                            )
                          }
                          className="w-full py-2 text-center text-sm font-semibold outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500">
                        중량 (kg)
                      </label>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 shadow-sm focus-within:ring-2 focus-within:ring-main">
                        <input
                          type="number"
                          min="0"
                          value={
                            focusedField?.index === index &&
                            focusedField?.field === "defaultWeight" &&
                            exercise.defaultWeight === 0
                              ? ""
                              : exercise.defaultWeight
                          }
                          onFocus={() =>
                            setFocusedField({ index, field: "defaultWeight" })
                          }
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) =>
                            handleUpdateExercise(
                              index,
                              "defaultWeight",
                              Number(e.target.value),
                            )
                          }
                          className="w-full py-2 text-center text-sm font-semibold outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500">
                        휴식 (초)
                      </label>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 shadow-sm focus-within:ring-2 focus-within:ring-main">
                        <input
                          type="number"
                          min="0"
                          step="10"
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
                          className="w-full py-2 text-center text-sm font-semibold outline-none"
                        />
                      </div>
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
