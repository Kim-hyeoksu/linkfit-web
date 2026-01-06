"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { PlanDetailSetDto, PlanDetailExerciseDto } from "@/entities/plan";
import type { SessionSetDto, SessionExerciseDto } from "@/entities/session";

// type ClientSet = ExerciseSet & {
//   localId?: string | number;
//   completedAt?: boolean;
// };
// type ClientExercise = {
//   exerciseId?: string | number;
//   sessionExerciseId?: string | number;
//   id?: string | number;
//   name?: string;
//   exerciseName?: string;
//   sets?: ClientSet[];
//   defaultReps?: number;
//   defaultWeight?: number;
//   restSeconds?: number;
// };

interface ExerciseProps {
  exercise: PlanDetailExerciseDto | SessionExerciseDto;
  sets: PlanDetailSetDto[] | SessionSetDto[];
  isCurrent?: boolean;
  isEditing?: boolean;
  currentExerciseSetId: number | string;
  onClickExercise: (sessionExerciseId: number | string) => void;
  addSets: (sessionExerciseId: number | string) => void;
  onClickSetCheckBtn: (
    sessionExerciseId: number | string,
    set: PlanDetailSetDto | SessionSetDto
  ) => void;
  onUpdateSet: (
    sessionExerciseId: number | string,
    setId: number | string,
    values: { weight: number; reps: number }
  ) => void;
  onDeleteSet: (
    sessionExerciseId: number | string,
    setId: number | string
  ) => void;
  onToggleEdit?: () => void;
}

export const ExerciseCard = ({
  exercise,
  sets,
  isCurrent,
  isEditing = false,
  currentExerciseSetId,
  onClickExercise,
  addSets,
  onClickSetCheckBtn,
  onUpdateSet,
  onDeleteSet,
  onToggleEdit,
}: ExerciseProps) => {
  const exerciseId = exercise.sessionExerciseId ?? (exercise as any).id;
  const exerciseName =
    exercise.name ??
    exercise.exerciseName ??
    (exercise as any)?.title ??
    "운동";

  const [tempWeight, setTempWeight] = useState("");
  const [tempReps, setTempReps] = useState("");
  const [editingSetId, setEditingSetId] = useState<number | string | null>(
    null
  );

  useEffect(() => {
    if (!isEditing) {
      setEditingSetId(null);
      setTempWeight("");
      setTempReps("");
    }
  }, [isEditing]);

  const handleToggleEdit = () => {
    onToggleEdit?.();
  };

  const handleEditStart = (set: any, field: "weight" | "reps" | null) => {
    setEditingSetId(set.id);
    setTempWeight(String(set.weight));
    setTempReps(String(set.reps));
  };

  const handleEditEnd = () => {
    if (editingSetId !== null) {
      onUpdateSet(exerciseId, editingSetId, {
        weight: Number(tempWeight),
        reps: Number(tempReps),
      });
    }
    setEditingSetId(null);
    setTempWeight("");
    setTempReps("");
  };

  const toggleChecked = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    sessionExerciseId: number | string,
    set: any
  ) => {
    e.stopPropagation();
    onClickSetCheckBtn(sessionExerciseId, set);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 border ${
        isCurrent ? "border-blue-500" : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div
        className="flex justify-between items-start mb-4"
        onClick={() => onClickExercise(exerciseId)}
      >
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-gray-800">{exerciseName}</h2>
          <p className="text-sm text-gray-500">
            {(exercise as any).bodyPart ?? "전신"} · {sets?.length} 세트
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleEdit();
            }}
            className="p-1 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Image
              src="/images/common/icon/edit-contained.svg"
              width={22}
              height={22}
              alt="수정"
            />
          </button>
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={(exercise as any).imgURL ?? "/next.svg"}
              width={64}
              height={64}
              alt={exerciseName}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Sets Header */}
      <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-bold mb-2 px-2">
        <div className="col-span-1"></div>
        <div className="col-span-2 text-center">SET</div>
        <div className="col-span-4 text-center">KG</div>
        <div className="col-span-5 text-center">REPS</div>
      </div>

      {/* 세트 리스트 */}
      <div className="flex flex-col gap-2">
        {sets.map((set, index) => {
          const setKey = set.id;
          return (
            <div
              key={setKey}
              className={`grid grid-cols-12 gap-2 items-center p-2 rounded-lg ${
                currentExerciseSetId === setKey
                  ? "bg-blue-50 border border-blue-400"
                  : "bg-gray-50"
              }`}
            >
              {/* 체크박스 or 삭제 */}
              <div className="col-span-1 flex justify-center">
                {isEditing ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSet(exerciseId, setKey);
                    }}
                    className="w-5 h-5 flex items-center justify-center rounded-full border border-red-400 text-red-500 text-base font-bold"
                  >
                    -
                  </button>
                ) : (
                  <div
                    onClick={(e) => toggleChecked(e, index, exerciseId, set)}
                    className={`w-5 h-5 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                      set.completedAt
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {set.completedAt && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </div>
                )}
              </div>
              <div className="col-span-2 text-center font-semibold text-gray-800">
                {index + 1}
              </div>
              {/* 무게 */}
              <div
                className="col-span-4 flex justify-center items-baseline"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditing) handleEditStart(set, "weight");
                }}
              >
                {isEditing ? (
                  <input
                    className="w-16 bg-white border border-gray-300 text-center rounded-md"
                    type="number"
                    value={
                      editingSetId === setKey ? tempWeight : String(set.weight)
                    }
                    onChange={(e) => setTempWeight(e.target.value)}
                    onBlur={handleEditEnd}
                    onKeyDown={(e) => e.key === "Enter" && handleEditEnd()}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="font-medium text-gray-800">
                    {set.weight ?? set.targetWeight}
                  </span>
                )}
                <span className="text-sm text-gray-600 ml-1.5">kg</span>
              </div>
              {/* 횟수 */}
              <div
                className="col-span-5 flex justify-center items-baseline"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditing) handleEditStart(set, "reps");
                }}
              >
                {isEditing ? (
                  <input
                    className="w-16 bg-white border border-gray-300 text-center rounded-md"
                    type="number"
                    value={
                      editingSetId === setKey ? tempReps : String(set.reps)
                    }
                    onChange={(e) => setTempReps(e.target.value)}
                    onBlur={handleEditEnd}
                    onKeyDown={(e) => e.key === "Enter" && handleEditEnd()}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="font-medium text-gray-800">
                    {set.reps ?? set.targetReps}
                  </span>
                )}
                <span className="text-sm text-gray-600 ml-1.5">회</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
        <button className="flex-1 py-2.5 px-4 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
          운동 메모
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addSets(exerciseId);
          }}
          className="bg-main flex-1 py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          세트 추가하기
        </button>
      </div>
    </div>
  );
};
