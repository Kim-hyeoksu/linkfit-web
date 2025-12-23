"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ExerciseSet } from "../";

type ClientSet = ExerciseSet & {
  localId?: string | number;
  completedAt?: boolean;
};
type ClientExercise = {
  exerciseId?: string | number;
  sessionExerciseId?: string | number;
  id?: string | number;
  name?: string;
  exerciseName?: string;
  sets?: ClientSet[];
  defaultReps?: number;
  defaultWeight?: number;
  restSeconds?: number;
};

interface ExerciseProps {
  exercise: ClientExercise;
  sets: ClientSet[];
  isCurrent?: boolean;
  isEditing?: boolean;
  currentExerciseSetId: number | string;
  onClickExercise: (sessionExerciseId: number | string) => void;
  addSets: (sessionExerciseId: number | string) => void;
  onClickSetCheckBtn: (
    sessionExerciseId: number | string,
    set: ClientSet
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
  const exerciseId = exercise.sessionExerciseId ?? -1;
  const exerciseName =
    exercise.name ??
    exercise.exerciseName ??
    (exercise as any)?.title ??
    "운동";

  const [rotated, setRotated] = useState(false);
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

  const handleEditStart = (set: ClientSet, field: "weight" | "reps" | null) => {
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
    set
  ) => {
    e.stopPropagation();
    onClickSetCheckBtn(sessionExerciseId, set);
  };

  return (
    <div onClick={() => onClickExercise(exerciseId)} className="py-5 px-5">
      <div className="flex items-center h-[48px] mb-3 ">
        <div className="w-[40px]">
          <button
            onClick={() => setRotated(!rotated)}
            className={`transition-transform duration-300 ${
              rotated ? "rotate-180" : "rotate-0"
            }`}
          >
            <Image
              src="/images/common/icon/navigation/arrow_forward_ios_24px.svg"
              width={24}
              height={24}
              alt="리셋"
            />
          </button>
        </div>
        <div className="flex gap-[8px]" style={{ flex: 1 }}>
          <div className="w-[48px] h-[48px] bg-black"></div>
          <div>
            <h1>{exerciseName}</h1>
            <div>{sets?.length}세트</div>
          </div>
        </div>
        <div>
          <button onClick={handleToggleEdit}>
            <Image
              src="/images/common/icon/edit-contained.svg"
              width={24}
              height={24}
              alt="리셋"
            />
          </button>
        </div>
      </div>

      {/* 세트 리스트 */}
      {!rotated && (
        <div className="text-sm  flex flex-col gap-[8px]">
          {sets.map((set, index) => {
            const setKey = set.id;
            return (
              <div
                key={setKey}
                className={`flex items-center px-2.5 justify-between h-[45px] border rounded-[8px] ${
                  currentExerciseSetId === setKey
                    ? "border-black"
                    : "border-[#d9d9d9]"
                }`}
              >
                {/* 체크박스 or 삭제 */}
                <div style={{ flex: 1 }}>
                  {isEditing ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSet(exerciseId, setKey);
                      }}
                      className="w-5 h-5 flex items-center justify-center rounded-full border border-red-300 text-red-500 text-xs font-bold"
                    >
                      X
                    </button>
                  ) : (
                    <div
                      onClick={(e) => toggleChecked(e, index, exerciseId, set)}
                      className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-400"
                    >
                      {set.completedAt && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>{index + 1}세트</div>
                {/* 무게 */}
                <div
                  className="flex"
                  style={{ flex: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditStart(set, "weight");
                  }}
                >
                  {isEditing ? (
                    <input
                      className="w-[25px] border border-gray-300 text-center"
                      type="number"
                      value={
                        editingSetId === setKey
                          ? tempWeight
                          : String(set.weight)
                      }
                      onChange={(e) => setTempWeight(e.target.value)}
                      onBlur={handleEditEnd}
                      onKeyDown={(e) => e.key === "Enter" && handleEditEnd()}
                    />
                  ) : (
                    <span className="inline-block w-[25px] text-center">
                      {set.weight}
                    </span>
                  )}
                  &nbsp;KG
                </div>
                {/* 횟수 */}
                <div
                  className="flex"
                  style={{ flex: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditStart(set, "reps");
                  }}
                >
                  {isEditing ? (
                    <input
                      className="w-[25px] border border-gray-300 text-center"
                      type="number"
                      value={
                        editingSetId === setKey ? tempReps : String(set.reps)
                      }
                      onChange={(e) => setTempReps(e.target.value)}
                      onBlur={handleEditEnd}
                      onKeyDown={(e) => e.key === "Enter" && handleEditEnd()}
                    />
                  ) : (
                    <span className="inline-block w-[25px] text-center">
                      {set.reps}
                    </span>
                  )}
                  &nbsp;회
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="text-sm mt-2 flex justify-between h-[32px]">
        <button className="w-[93px] border border-[#d9d9d9] rounded-[8px]">
          운동 메모
        </button>
        <button
          onClick={() => addSets(exerciseId)}
          className="w-[207px] border border-[#d9d9d9] rounded-[8px]"
        >
          세트 추가하기
        </button>
      </div>
    </div>
  );
};
