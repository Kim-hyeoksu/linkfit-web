"use client";

import React, { useState, useEffect, useRef } from "react";
import ExerciseCard from "@/entities/exercise/ui/ExerciseCard";
import Timer from "@/components/common/Timer";
import { Exercise } from "@/entities/exercise/model/types";
import Header from "@/components/common/header";
export default function WorkoutDayClient({
  initialExercises,
}: {
  initialExercises: Exercise[];
}) {
  const TIMER_HEIGHT = 375;
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);

  const [currentExerciseId, setCurrentExerciseId] = useState<number | null>(
    null
  );
  const [completedSetIds, setCompletedSetIds] = useState<Set<number>>(
    new Set()
  );
  const exerciseRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [showType, setShowType] = useState<"bar" | "full">("bar");
  const [startTrigger, setStartTrigger] = useState(0);

  // 데이터 로딩

  // 영역 밖 클릭 시 선택 해제
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setCurrentExerciseId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSetCompletion = (setId: number) => {
    setCompletedSetIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(setId)) {
        newSet.delete(setId);
      } else {
        newSet.add(setId);
      }
      setStartTrigger((t) => t + 1);
      return newSet;
    });
  };

  const handleExerciseClick = (id: number) => {
    setCurrentExerciseId(id);
    setTimeout(() => {
      const el = exerciseRefs.current.get(id);
      if (el && wrapperRef.current) {
        wrapperRef.current.scrollTo({
          top: el.offsetTop - 56,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  const nextExercise = () => {
    const currentIndex = exercises.findIndex(
      (item) => item.id === currentExerciseId
    );
    if (currentIndex !== -1 && currentIndex + 1 < exercises.length) {
      const nextExerciseId = exercises[currentIndex + 1].id;
      handleExerciseClick(nextExerciseId);
    }
  };

  const addSets = (id: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id !== id) return exercise;
        const lastSet = exercise.sets[exercise.sets.length - 1];
        const newSet = { ...lastSet, id: lastSet.id + 1 };
        return { ...exercise, sets: [...exercise.sets, newSet] };
      })
    );
  };

  const handleUpdateSet = (
    setId: number,
    values: { weight: number; reps: number }
  ) => {
    setExercises((prev) =>
      prev.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) =>
          set.id === setId ? { ...set, ...values } : set
        ),
      }))
    );
  };

  const handleSave = async () => {
    const completedSets = exercises.flatMap((exercise) =>
      exercise.sets.filter((set) => completedSetIds.has(set.id))
    );
    await fetch("/api/save-sets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(completedSets),
    });
    console.log("저장한 세트:", completedSets);
  };

  return (
    <div>
      <Header />
      <div
        ref={wrapperRef}
        className="overflow-y-auto"
        style={{
          height: `calc(100vh - 60px - ${
            showType === "full" ? TIMER_HEIGHT : 0
          }px)`,
        }}
      >
        <div className="flex flex-col gap-[10px] bg-[#F7F8F9]">
          {exercises?.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white"
              ref={(el) => {
                if (el) exerciseRefs.current.set(exercise.id, el);
              }}
            >
              <ExerciseCard
                {...exercise}
                completedSetIds={completedSetIds}
                isSelected={exercise.id === currentExerciseId}
                onClickExercise={handleExerciseClick}
                onClickSetCheckBtn={toggleSetCompletion}
                addSets={addSets}
                onUpdateSet={handleUpdateSet}
              />
            </div>
          ))}
        </div>

        <Timer
          startTrigger={startTrigger}
          restSeconds={
            exercises?.find((item) => item.id === currentExerciseId)
              ?.restSeconds
          }
          nextExercise={nextExercise}
          showType={showType}
          onShowTypeChange={(newType) => setShowType(newType)}
        />
      </div>
    </div>
  );
}
