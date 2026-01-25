"use client";
import Image from "next/image";
import { Header, Modal } from "@/shared";
import { useState, useEffect } from "react";
import { ExerciseList, type Exercise } from "@/entities/exercise";
import { getExercises } from "@/entities/exercise";
const ProgramAddPage = () => {
  const [workoutFrequencyPerWeek, setWorkoutFrequencyPerWeek] = useState([]);
  const [workoutDaysOfWeek, setWorkoutDaysOfWeek] = useState([]);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await getExercises();
        setExercises(data);
      } catch (error) {
        console.error("운동 목록 조회 실패:", error);
      }
    };
    loadExercises();
  }, []);

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => [...prev, exercise]);
    setIsExerciseModalOpen(false);
  };

  return (
    <div className=" flex flex-col gap-2 bg-[#F7F8F9]">
      <Header title="새로운 루틴">
        <div>(0/15)</div>
      </Header>
      <div className="p-5 bg-white gap-3 flex flex-col">
        {selectedExercises.map((exercise, index) => (
          <div
            key={`${exercise.id}-${index}`}
            className="bg-white p-4 rounded-lg border border-[#e5e5e5] shadow-sm flex justify-between items-center"
          >
            <div>
              <div className="font-bold text-gray-900">{exercise.name}</div>
              <div className="text-sm text-gray-500">{exercise.bodyPart}</div>
            </div>
          </div>
        ))}
        <button
          onClick={() => setIsExerciseModalOpen(true)}
          className="flex justify-center items-center gap-1 border border-[#d9d9d9] rounded-lg w-full p-2"
        >
          <Image
            alt="add-program"
            src="/images/common/icon/add_circle_outline_24px.svg"
            width={20}
            height={20}
          />
          운동 추가하기
        </button>
      </div>
      <Modal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        title="운동 목록"
      >
        <div className="h-[60vh] overflow-y-auto">
          <ExerciseList exercises={exercises} onSelect={handleSelectExercise} />
        </div>
      </Modal>
    </div>
  );
};

export default ProgramAddPage;
