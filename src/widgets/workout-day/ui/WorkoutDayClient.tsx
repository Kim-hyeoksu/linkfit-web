"use client";

import React, { useState, useEffect, useRef } from "react";
import ExerciseCard from "@/entities/exercise/ui/ExerciseCard";
import Timer from "@/components/common/Timer";
import { Exercise } from "@/entities/exercise/model/types";
import Header from "@/components/common/Header";
import { formatTime } from "@/shared/utils/formatTime";
export default function WorkoutDayClient({
  initialExercises,
}: {
  initialExercises: Exercise[];
}) {
  const TIMER_HEIGHT = 375;
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);

  const [currentExerciseId, setCurrentExerciseId] = useState<number | string>(
    exercises[0].id
  );
  const [currentExerciseSetId, setCurrentExerciseSetId] = useState<
    number | string
  >(exercises[0].sets[0].id);
  const [completedSetIds, setCompletedSetIds] = useState<Set<number>>(
    new Set()
  );
  const exerciseRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [showType, setShowType] = useState<"bar" | "full">("bar");
  const [startTrigger, setStartTrigger] = useState(0);

  const [totalExerciseMs, setTotalExerciseMs] = useState(0);

  // 데이터 로딩

  // 영역 밖 클릭 시 선택 해제
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setCurrentExerciseId(0);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startExerciseTimer = () => {
    setInterval(() => {
      setTotalExerciseMs((prev) => {
        console.log("1초 증가", prev + 1000);
        return prev + 1000;
      });
    }, 1000);
  };
  const toggleSetCompletion = (exerciseId: number, setId: number) => {
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
    // setCurrentExerciseId(exerciseId);
    handleNextSet(exerciseId);
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
  // 다음 세트로 이동
  const handleNextSet = (exerciseId: number) => {
    console.log("currentExerciseSetId", currentExerciseSetId);
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;
    const currentSetIndex = exercise.sets.findIndex(
      (set) => set.id === currentExerciseSetId
    );
    // 다음 세트로 이동, 마지막이면 null로 초기화
    const nextSet = exercise.sets[currentSetIndex + 1];
    console.log("nextSet", nextSet);
    // 다음 세트가 없다면 다음 종목의 첫 세트로 이동
    if (!nextSet) {
      console.log("다음 세트 없다");
      const currentExerciseIndex = exercises.findIndex(
        (item) => item.id === exerciseId
      );
      const nextExerciseFirstSet = exercises[currentExerciseIndex + 1];
      setCurrentExerciseSetId(
        nextExerciseFirstSet ? nextExerciseFirstSet.sets[0].id : -1
      );
      console.log("nextExerciseFirstSet.id", nextExerciseFirstSet.sets[0].id);
      nextExercise(exerciseId);
    } else {
      setCurrentExerciseSetId(nextSet ? nextSet.id : 0);
    }
  };

  const nextExercise = (exerciseId: number) => {
    const currentIndex = exercises.findIndex((item) => item.id === exerciseId);
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
      <Header
        showBackButton={true}
        onRightClick={() => setStartTrigger((t) => t + 1)}
        title={formatTime(totalExerciseMs)}
      >
        <button
          onClick={startExerciseTimer}
          className="bg-main text-white w-[124px] h-[32px] rounded-lg"
        >
          운동 시작
        </button>
      </Header>
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
                isCurrent={exercise.id === currentExerciseId}
                currentExerciseSetId={currentExerciseSetId}
                onClickExercise={handleExerciseClick}
                onClickSetCheckBtn={toggleSetCompletion}
                addSets={addSets}
                onUpdateSet={handleUpdateSet}
                setExercises={setExercises}
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
