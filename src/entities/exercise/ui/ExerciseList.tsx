"use client";

import Image from "next/image";
import { Dumbbell } from "lucide-react";
import { Exercise } from "@/entities/exercise";

interface ExerciseListProps {
  exercises: (Partial<Exercise> & {
    id: number;
    name: string;
    bodyPart: string;
  })[];
  onSelect?: (exercise: any) => void;
}

const getImageUrl = (ex: any) => {
  const path = ex.imagePath || ex.exerciseImagePath || ex.imageUrl;
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export function ExerciseList({ exercises, onSelect }: ExerciseListProps) {
  return (
    <div className="flex flex-col gap-3">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          onClick={() => onSelect?.(exercise)}
          className="bg-white p-4 rounded-lg border border-[#e5e5e5] shadow-sm flex justify-between items-center cursor-pointer"
        >
          <div>
            <div className="font-bold text-gray-900">{exercise.name}</div>
            <div className="text-sm text-gray-500">{exercise.bodyPart}</div>
          </div>
          <div className="w-16 h-16 bg-slate-50 flex-shrink-0 rounded-xl overflow-hidden shadow-inner border border-slate-100 flex items-center justify-center relative">
            {getImageUrl(exercise as any) ? (
              <Image
                src={getImageUrl(exercise as any)!}
                alt={exercise.name}
                fill
                className="object-cover"
              />
            ) : (
              <Dumbbell size={24} className="text-slate-300" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
