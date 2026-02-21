"use client";

import React from "react";
import Image from "next/image";
import { Check, Edit2, Plus, Minus } from "lucide-react";
import type { ClientSet, ClientExercise } from "../model/types";

interface ExerciseProps {
  exercise: ClientExercise;
  sets: ClientSet[];
  isCurrent?: boolean;
  isEditing?: boolean;
  currentExerciseSetId: number;
  onClickExercise: (sessionExerciseId: number) => void;
  addSets: (sessionExerciseId: number) => void;
  onClickSetCheckBtn: (sessionExerciseId: number, set: ClientSet) => void;
  onUpdateSet: (
    sessionExerciseId: number,
    setId: number,
    values: { weight: number; reps: number },
  ) => void;
  onDeleteSet: (sessionExerciseId: number, setId: number) => void;
  onToggleEdit?: () => void;
  onUpdateDefault?: (
    sessionExerciseId: number,
    weight: number,
    reps: number,
  ) => void;
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
  onUpdateDefault,
}: ExerciseProps) => {
  const exerciseId = exercise.sessionExerciseId;
  const exerciseName = exercise.exerciseName;

  const handleToggleEdit = () => {
    onToggleEdit?.();
  };

  const toggleChecked = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    sessionExerciseId: number,
    set: ClientSet,
  ) => {
    e.stopPropagation();
    onClickSetCheckBtn(sessionExerciseId, set);
  };

  return (
    <div
      className={`relative bg-white rounded-[24px] shadow-sm transition-all duration-300 border-[1.5px] overflow-hidden ${
        isCurrent
          ? "border-main shadow-md transform scale-[1.01] z-10"
          : "border-transparent hover:border-slate-200"
      }`}
      onClick={() => onClickExercise(exerciseId)}
    >
      {/* Decorative side accent for current exercise */}
      {isCurrent && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-main rounded-l-full" />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-grow space-y-1.5">
            <h2 className="text-[20px] font-extrabold text-[#1e293b] leading-tight tracking-tight">
              {exerciseName}
            </h2>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                {exercise.bodyPart ?? "전신"}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eff6ff] text-main uppercase tracking-wider">
                {sets?.length} SETS
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleEdit();
              }}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all active:scale-95 group"
            >
              <Image
                src="/images/common/icon/edit-contained.svg"
                width={20}
                height={20}
                alt="수정"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </button>
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner bg-slate-100 border border-slate-50">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${exercise.exerciseImagePath ?? "/next.svg"}`}
                width={64}
                height={64}
                alt={exerciseName}
                className="object-cover w-full h-full transform transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        </div>

        {/* 편집 모드일 때 기본값 설정 영역 */}
        {isEditing && (
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-6 items-center justify-center animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-slate-500">
                기본 무게
              </span>
              <div className="relative group">
                <input
                  type="number"
                  className="w-16 h-9 pb-1 bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:border-main focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  value={exercise.defaultWeight}
                  onChange={(e) =>
                    onUpdateDefault?.(
                      exerciseId,
                      Number(e.target.value),
                      exercise.defaultReps,
                    )
                  }
                />
                <span className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full text-xs font-bold text-slate-400">
                  kg
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-6">
              <span className="text-[12px] font-bold text-slate-500">
                기본 횟수
              </span>
              <div className="relative group">
                <input
                  type="number"
                  className="w-16 h-9 pb-1 bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:border-main focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  value={exercise.defaultReps}
                  onChange={(e) =>
                    onUpdateDefault?.(
                      exerciseId,
                      exercise.defaultWeight,
                      Number(e.target.value),
                    )
                  }
                />
                <span className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full text-xs font-bold text-slate-400">
                  회
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sets List */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-12 gap-2 text-[11px] text-slate-400 font-extrabold px-3 uppercase tracking-widest hidden sm:grid">
            <div className="col-span-1"></div>
            <div className="col-span-2 text-center">SET</div>
            <div className="col-span-4 text-center">WEIGHT (kg)</div>
            <div className="col-span-5 text-center">REPS (횟수)</div>
          </div>

          <div className="flex flex-col gap-2.5">
            {sets.map((set, index) => {
              const setKey = set.id;
              const isSetCurrent = currentExerciseSetId === setKey;
              const isCompleted = !!set.completedAt;

              return (
                <div
                  key={setKey}
                  className={`grid grid-cols-12 gap-2 items-center p-3.5 rounded-[16px] transition-all duration-300 ${
                    isSetCurrent
                      ? "bg-blue-50/50 border border-main/30 shadow-sm ring-1 ring-main/10"
                      : isCompleted
                        ? "bg-slate-50/80 opacity-80"
                        : "bg-slate-50 hover:bg-slate-100/80"
                  }`}
                >
                  {/* 체크박스 or 삭제 */}
                  <div className="col-span-2 sm:col-span-1 flex justify-center">
                    {isEditing ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSet(exerciseId, setKey);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all transform active:scale-95 shadow-sm"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                    ) : (
                      <div
                        onClick={(e) => toggleChecked(e, exerciseId, set)}
                        className={`w-7 h-7 flex items-center justify-center rounded-full border-2 transition-all duration-300 active:scale-90 ${
                          isCompleted
                            ? "bg-main border-main shadow-md shadow-blue-200"
                            : "bg-white border-slate-300 hover:border-main"
                        }`}
                      >
                        {isCompleted && (
                          <Check
                            size={16}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 text-center text-[15px] font-black text-slate-700">
                    <span
                      className={
                        isCompleted
                          ? "text-slate-400 line-through decoration-slate-300"
                          : ""
                      }
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* 무게 */}
                  <div className="col-span-4 flex justify-center items-center">
                    {isEditing ? (
                      <div className="relative">
                        <input
                          className="w-16 h-8 bg-white border border-slate-200 text-center rounded-md font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                          type="number"
                          value={String(set.weight || set.targetWeight || "")}
                          onChange={(e) =>
                            onUpdateSet(exerciseId, set.id, {
                              weight: Number(e.target.value),
                              reps: set.reps,
                            })
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ) : (
                      <span
                        className={`text-[16px] font-extrabold ${isCompleted ? "text-slate-400" : "text-[#1e293b]"}`}
                      >
                        {set.weight || set.targetWeight}{" "}
                        <span className="text-[12px] font-medium text-slate-400 ml-0.5">
                          kg
                        </span>
                      </span>
                    )}
                  </div>

                  {/* 횟수 */}
                  <div className="col-span-4 flex justify-center items-center">
                    {isEditing ? (
                      <input
                        className="w-16 h-8 bg-white border border-slate-200 text-center rounded-md font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        type="number"
                        value={String(set.reps || set.targetReps || "")}
                        onChange={(e) =>
                          onUpdateSet(exerciseId, set.id, {
                            weight: set.weight,
                            reps: Number(e.target.value),
                          })
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        className={`text-[16px] font-extrabold ${isCompleted ? "text-slate-400" : "text-[#1e293b]"}`}
                      >
                        {set.reps || set.targetReps}{" "}
                        <span className="text-[12px] font-medium text-slate-400 ml-0.5">
                          회
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex gap-3">
          <button className="flex-[0.4] min-w-[32px] h-11 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all transform active:scale-95">
            <Edit2 size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addSets(exerciseId);
            }}
            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-2xl bg-[#eff6ff] text-main font-black text-[14px] hover:bg-main hover:text-white transition-all transform active:scale-95 shadow-sm shadow-blue-50"
          >
            <Plus size={18} /> 세트 추가하기
          </button>
        </div>
      </div>
    </div>
  );
};
