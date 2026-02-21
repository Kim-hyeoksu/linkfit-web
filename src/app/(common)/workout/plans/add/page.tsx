"use client";
import { Header, Modal } from "@/shared";
import { useState, useEffect } from "react";
import { ExerciseList, type Exercise, getExercises } from "@/entities/exercise";
import { PlusCircle } from "lucide-react";

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
      defaultSets: 3,
      defaultReps: 10,
      defaultWeight: 20,
      defaultRestSeconds: 60,
    };
    setExercises([...exercises, newExercise]);
    setIsExerciseSelectorOpen(false);
  };

  const handleSavePlan = () => {
    if (!title.trim()) {
      alert("플랜 제목을 입력해주세요.");
      return;
    }
    if (exercises.length === 0) {
      alert("최소 한 개의 운동을 추가해주세요.");
      return;
    }

    const planData = {
      title,
      description,
      exercises,
    };

    console.log("저장할 플랜 데이터:", planData);
    alert("나만의 플랜이 저장되었습니다! (콘솔 확인)");
    // TODO: 실제 API 연동 (ex. createStandalonePlan(planData)) 추가 및 이전 페이지로 이동
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
            <div className="min-h-[100px] mt-2 border-t border-gray-100 pt-4">
              <ExerciseList
                exercises={exercises.map((e) => ({
                  id: e.exerciseId,
                  name: e.name,
                  bodyPart: e.bodyPart,
                }))}
              />
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
