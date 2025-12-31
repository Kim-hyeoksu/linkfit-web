"use client";

import { useEffect, useState } from "react";
import { Header } from "@/shared";
import { getExercises } from "@/entities/exercise";
import { Exercise } from "@/entities/exercise/model/types";
import ExerciseList from "@/entities/exercise/ui/ExerciseList";

export default function ExerciseListPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await getExercises();
        setExercises(data);
      } catch (error) {
        console.error("운동 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8F9]">
      <Header title="운동 종목" showBackButton={true}>
        <div />
      </Header>
      <div className="px-5 pt-[72px] pb-10">
        {loading ? (
          <div className="text-center text-gray-500 mt-10">불러오는 중...</div>
        ) : exercises.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            등록된 운동이 없습니다.
          </div>
        ) : (
          <ExerciseList exercises={exercises} />
        )}
      </div>
    </div>
  );
}
