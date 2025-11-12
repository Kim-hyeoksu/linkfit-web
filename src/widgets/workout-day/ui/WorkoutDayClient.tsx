"use client";

import React, { useState, useEffect, useRef } from "react";
import { ExerciseCard } from "@/entities/exercise";
import { Timer } from "@/entities/exercise";
import { Exercise } from "@/entities/exercise";
import { Header } from "@/shared";
import { formatTime } from "@/shared";
export default function WorkoutDayClient({
  initialExercises,
}: {
  initialExercises: Exercise[];
}) {
  const TIMER_HEIGHT = 375;
  const [exercises, setExercises] = useState<Exercise[]>(
    initialExercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((s) => ({ ...s, isComplete: s.isComplete ?? false })),
    }))
  );
  console.log("exercises", exercises);
  const [currentExerciseId, setCurrentExerciseId] = useState<number | string>(
    initialExercises[0].id
  );
  console.log(
    "currentExerciseId seconds",
    exercises?.find((item) => item.id === currentExerciseId)?.restSeconds || 60
  );
  const [currentExerciseSetId, setCurrentExerciseSetId] = useState<
    number | string
  >(exercises[0].sets[0].id);
  const exerciseRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [showType, setShowType] = useState<"bar" | "full">("bar");
  const [startTrigger, setStartTrigger] = useState(0);

  const [totalExerciseMs, setTotalExerciseMs] = useState(0);
  const [pendingExerciseId, setPendingExerciseId] = useState<number | string>(
    -1
  );
  // 데이터 로딩

  // 영역 밖 클릭 시 선택 해제
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       wrapperRef.current &&
  //       !wrapperRef.current.contains(event.target as Node)
  //     ) {
  //       setCurrentExerciseId(0);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const startExerciseTimer = () => {
    setInterval(() => {
      setTotalExerciseMs((prev) => {
        return prev + 1000;
      });
    }, 1000);
  };
  // const toggleSetCompletion = (exerciseId: number, setId: number) => {
  //   setCompletedSetIds((prev) => {
  //     const newSet = new Set(prev);
  //     // 체크 해제시
  //     if (newSet.has(setId)) {
  //       newSet.delete(setId);
  //       setCurrentExerciseSetId(setId);
  //     }
  //     // 체크시
  //     else {
  //       newSet.add(setId);
  //       console.log("체크해제아님");
  //       handleExerciseClick(exerciseId);
  //       handleNextSet(exerciseId);
  //     }
  //     setStartTrigger((t) => t + 1);
  //     return newSet;
  //   });
  //   // setCurrentExerciseId(exerciseId);
  // };

  const toggleSetCompletion = (
    exerciseId: number | string,
    setId: number | string
  ) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;

        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId ? { ...set, isComplete: !set.isComplete } : set
          ),
        };
      })
    );
    setPendingExerciseId(exerciseId); // ✅ 다음 세트 계산 예약
    setCurrentExerciseId(exerciseId);
    setCurrentExerciseSetId(setId);
    if (startTrigger === 0) {
      startExerciseTimer();
    }
    setStartTrigger((t) => t + 1);
  };
  useEffect(() => {
    if (pendingExerciseId !== -1) {
      handleNextSet(pendingExerciseId);
      // handleExerciseClick(pendingExerciseId);
      setPendingExerciseId(-1);
    }
  }, [exercises]);
  const handleExerciseClick = (id: number) => {
    if (startTrigger === 0) return;
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
  // const handleNextSet = (exerciseId: number) => {
  //   const exercise = exercises.find((ex) => ex.id === exerciseId);
  //   if (!exercise) return;
  //   const currentSetIndex = exercise.sets.findIndex(
  //     (set) => set.id === currentExerciseSetId
  //   );
  //   // 다음 세트로 이동, 마지막이면 null로 초기화
  //   const nextSet = exercise.sets[currentSetIndex + 1];
  //   // 다음 세트가 없다면 다음 종목의 첫 세트로 이동
  //   if (!nextSet) {
  //     const currentExerciseIndex = exercises.findIndex(
  //       (item) => item.id === exerciseId
  //     );
  //     const nextExerciseFirstSet = exercises[currentExerciseIndex + 1];
  //     setCurrentExerciseSetId(
  //       nextExerciseFirstSet ? nextExerciseFirstSet.sets[0].id : -1
  //     );
  //     nextExercise(exerciseId);
  //   } else {
  //     setCurrentExerciseSetId(nextSet ? nextSet.id : 0);
  //   }
  // };
  const handleNextSet = (exerciseId: number | string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;
    // 아직 완료되지 않은 세트를 찾음
    const nextIncompleteSet = exercise.sets.find((set) => !set.isComplete);
    console.log("nextIncompleteSet", nextIncompleteSet);

    if (nextIncompleteSet) {
      // 완료되지 않은 세트가 있으면 거기로 이동
      setCurrentExerciseSetId(nextIncompleteSet.id);
    } else {
      // 현재 운동의 모든 세트를 완료한 경우 다음 운동으로 이동
      const currentExerciseIndex = exercises.findIndex(
        (item) => item.id === exerciseId
      );
      const nextExercise = exercises[currentExerciseIndex + 1];

      if (nextExercise) {
        const nextExerciseFirstIncompleteSet = nextExercise.sets.find(
          (set) => !set.isComplete
        );

        // 다음 운동의 첫 미완료 세트로 이동
        if (nextExerciseFirstIncompleteSet) {
          setCurrentExerciseSetId(nextExerciseFirstIncompleteSet.id);
        } else {
          // 다음 운동의 세트가 모두 완료된 경우 -1로 설정
          setCurrentExerciseSetId(-1);
        }

        handleExerciseClick(nextExercise.id);
      } else {
        // 모든 운동이 끝난 경우
        setCurrentExerciseSetId(-1);
      }
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
      exercise.sets.filter((set) => set.isComplete)
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
      <Header showBackButton={true} title={formatTime(totalExerciseMs)}>
        {totalExerciseMs > 0 ? (
          <button
            onClick={handleSave}
            className="bg-light-gray text-dark-gray w-[124px] h-[32px] rounded-lg"
          >
            운동 종료
          </button>
        ) : (
          <button
            onClick={startExerciseTimer}
            className="bg-main text-white w-[124px] h-[32px] rounded-lg"
          >
            운동 시작
          </button>
        )}
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
        {currentExerciseId}/{currentExerciseSetId}
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
              ?.restSeconds || 60
          }
          nextExercise={nextExercise}
          showType={showType}
          onShowTypeChange={(newType) => setShowType(newType)}
          onCompleteSet={toggleSetCompletion}
          currentExerciseId={currentExerciseId}
          currentExerciseSetId={currentExerciseSetId}
        />
      </div>
    </div>
  );
}
