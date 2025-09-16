"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

import axios from "axios";
import Exercise from "@/components/common/Exercise";
import Timer from "@/components/common/Timer";

// 한 세트 정보 타입
export interface ExerciseSet {
  id: number;
  weight: number;
  reps: number;
}

// 운동 정보 타입
export interface Exercise {
  id: number;
  name: string;
  restSeconds: number;
  sets: ExerciseSet[];
}
export default function WorkoutDayPage() {
  const { routineId } = useParams();
  const TIMER_HEIGHT = 375;
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
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
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data } = await axios.get<Exercise[]>(
          `/api/exercises/${routineId}`
        );
        console.log("data", data);
        setExercises(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [routineId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // wrapperRef 영역 안이면 클릭 무시
      // contains 메소드는 Node || null 타입을 받지만 event.target의 타입은 EventTarget
      // 따라서 Node로 타입 단언
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setCurrentExerciseId(null); // 선택 초기화 → Timer 숨김
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

      console.log("exercises", exercises);
      return newSet;
    });
  };

  const handleExerciseClick = (id: number) => {
    setCurrentExerciseId(id);

    // 클릭된 Exercise가 상단으로 스크롤되도록
    setTimeout(() => {
      const el = exerciseRefs.current.get(id);
      if (el && wrapperRef.current) {
        // wrapperRef 내부 스크롤
        wrapperRef.current.scrollTo({
          top: el.offsetTop - 56,
          behavior: "smooth",
        });
      }
    }, 50); // 렌더 후 refs 적용
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
    setExercises((prevExercises) => {
      return prevExercises.map((exercise) => {
        if (exercise.id !== id) return exercise;

        const lastSet = exercise.sets[exercise.sets.length - 1];
        const newSet = { ...lastSet, id: lastSet.id + 1 }; // 새 세트 ID 증가
        return {
          ...exercise,
          sets: [...exercise.sets, newSet], // 새 배열 생성
        };
      });
    });
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

    // 실제 API 호출 (예시)
    await fetch("/api/save-sets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(completedSets),
    });

    console.log("저장한 세트:", completedSets);
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {/* Exercise + Timer 영역만 감싸는 ref */}
      <div
        ref={wrapperRef}
        className="overflow-y-auto"
        style={{
          height: `calc(100vh - 60px - ${
            showType === "full" ? TIMER_HEIGHT : 0
          }px)`,
        }}
      >
        <div className="flex flex-col gap-[10px]  bg-[#F7F8F9]">
          {exercises.map((exercise) => (
            <div
              className="bg-white"
              key={exercise.id}
              ref={(el) => {
                if (el) exerciseRefs.current.set(exercise.id, el);
              }}
            >
              <Exercise
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
            exercises.find((item) => item.id === currentExerciseId)?.restSeconds
          }
          nextExercise={nextExercise}
          showType={showType}
          onShowTypeChange={(newType) => setShowType(newType)}
        />
      </div>
    </div>
  );
}
