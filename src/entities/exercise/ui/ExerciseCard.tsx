"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface SetItem {
  id: number;
  weight: number;
  reps: number;
}

interface ExerciseProps {
  id: number;
  name: string;
  sets: SetItem[];
  completedSetIds: Set<number>;
  isSelected?: boolean;
  onClickExercise: (id: number) => void;
  addSets: (id: number) => void;
  onClickSetCheckBtn: (setId: number) => void;
  onUpdateSet: (
    setId: number,
    values: { weight: number; reps: number }
  ) => void;
}
const ExcerciseCard = ({
  id,
  name,
  sets,
  completedSetIds,
  isSelected,
  onClickExercise,
  addSets,
  onClickSetCheckBtn,
  onUpdateSet,
}: ExerciseProps) => {
  const [rotated, setRotated] = useState(false);
  const [tempWeight, setTempWeight] = useState("");
  const [tempReps, setTempReps] = useState("");
  const [editingSetId, setEditingSetId] = useState<number | null>(null);
  const [editingTarget, setEditingTarget] = useState<{
    setId: number | null;
    field: "weight" | "reps" | null;
  }>({ setId: null, field: null });

  const weightInputRef = useRef<HTMLInputElement | null>(null);
  const repsInputRef = useRef<HTMLInputElement | null>(null);

  const handleEditStart = (set: SetItem, field: "weight" | "reps" | null) => {
    setEditingSetId(set.id);
    setTempWeight(String(set.weight));
    setTempReps(String(set.reps));
    setEditingTarget({ setId: set.id, field });

    console.log("set", set, editingSetId);
  };

  useEffect(() => {
    console.log("editingTarget", editingTarget);
    if (editingTarget.setId !== null) {
      if (editingTarget.field === "weight" || editingTarget.field === null) {
        weightInputRef.current?.focus();
      } else if (editingTarget.field === "reps") {
        repsInputRef.current?.focus();
      }
    }
  }, [editingTarget]);

  const handleEditEnd = () => {
    if (editingSetId) {
      onUpdateSet(editingSetId, {
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
    exerciseId: number,
    setId: number
  ) => {
    e.stopPropagation();
    onClickExercise(exerciseId);
    onClickSetCheckBtn(setId);
  };

  return (
    <div onClick={() => onClickExercise(id)} className="py-5 px-5">
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
            <h1>{name}</h1>
            <div>{sets?.length}세트</div>
          </div>
        </div>
        <div>
          <button>
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
            const isCompleted = completedSetIds.has(set.id);
            const isEditing = editingSetId === set.id;

            return (
              <div
                onClick={() => handleEditStart(set, null)}
                key={set?.id}
                className="flex items-center px-2.5 justify-between h-[45px] border border-[#d9d9d9] rounded-[8px]"
              >
                {/* 체크박스 */}
                <div style={{ flex: 1 }}>
                  <div
                    onClick={(e) => toggleChecked(e, index, id, set.id)}
                    className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-400"
                  >
                    {isCompleted && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
                <div style={{ flex: 1 }}>{index + 1}세트</div>
                {/* 무게 */}
                <div
                  className="flex"
                  style={{ flex: 1 }}
                  onClick={(e) => {
                    if (!isEditing) {
                      e.stopPropagation();
                      handleEditStart(set, "weight");
                    }
                  }}
                >
                  {isEditing ? (
                    <input
                      ref={weightInputRef}
                      className="w-[25px] border border-gray-300 text-center"
                      type="number"
                      value={tempWeight}
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
                    if (!isEditing) {
                      e.stopPropagation();
                      handleEditStart(set, "reps");
                    }
                  }}
                >
                  {isEditing ? (
                    <input
                      ref={repsInputRef}
                      className="w-[25px] border border-gray-300 text-center"
                      type="number"
                      value={tempReps}
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
          onClick={() => addSets(id)}
          className="w-[207px] border border-[#d9d9d9] rounded-[8px]"
        >
          세트 추가하기
        </button>
      </div>
    </div>
  );
};

export default ExcerciseCard;
