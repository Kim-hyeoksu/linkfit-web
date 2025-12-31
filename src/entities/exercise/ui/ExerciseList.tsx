"use client";

import { Exercise } from "@/entities/exercise";

interface ExerciseListProps {
  exercises: Exercise[];
}

export default function ExerciseList({ exercises }: ExerciseListProps) {
  return (
    <div className="flex flex-col gap-3">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="bg-white p-4 rounded-lg border border-[#e5e5e5] shadow-sm"
        >
          <div className="font-bold text-gray-900">{exercise.name}</div>
        </div>
      ))}
    </div>
  );
}
