"use client";

import React, { useMemo } from "react";
import Model from "react-body-highlighter";

// Define our own IExerciseData since Model exports it, but just in case
interface HeatmapData {
  name: string;
  muscles: string[];
  frequency: number;
}

interface MuscleHeatmapProps {
  volumeMap: Record<string, { score: number; volume: number }>;
}

// Map linkfit Korean body parts to react-body-highlighter muscles
const BODY_PART_TO_MUSCLES: Record<string, string[]> = {
  // 세부 부위 (추가 및 한글명 매핑)
  chest: ["chest"],
  deltoids: ["front-deltoids", "back-deltoids"],
  triceps: ["triceps"],
  biceps: ["biceps"],
  forearm: ["forearm"],
  trapezius: ["trapezius"],
  "upper-back": ["upper-back"],
  "lower-back": ["lower-back"],
  abs: ["abs"],
  obliques: ["obliques"],
  quadriceps: ["quadriceps"],
  hamstring: ["hamstring"],
  calves: ["calves"],
  gluteal: ["gluteal"],
  adductor: ["adductor"],
  abductors: ["abductors"],
  "front-deltoids": ["front-deltoids"],
  "back-deltoids": ["back-deltoids"],
};

// Tooltip에 표시할 세부 근육 명칭 매핑
const MUSCLE_DISPLAY_NAME: Record<string, string> = {
  chest: "가슴",
  deltoids: "어깨",
  "upper-back": "등 상부",
  "lower-back": "등 하부",
  trapezius: "승모근",
  biceps: "이두근",
  triceps: "삼두근",
  forearm: "전완근",
  "front-deltoids": "전면삼각근",
  "back-deltoids": "후면삼각근",
  abs: "복근",
  obliques: "옆구리",
  quadriceps: "대퇴사두근",
  hamstring: "햄스트링",
  gluteal: "둔근",
  calves: "종아리",
  adductor: "내전근",
  abductors: "외전근",
};

import { BottomSheet } from "@/shared/ui";
import { getMuscleSessions } from "@/entities/exercise/api/getMuscleSessions";
import type { MuscleSession } from "@/entities/exercise/api/getMuscleSessions";

interface MuscleHeatmapProps {
  volumeMap: Record<string, { score: number; volume: number }>;
  startDate?: string;
  endDate?: string;
}

export function MuscleHeatmap({
  volumeMap,
  startDate,
  endDate,
}: MuscleHeatmapProps) {
  const [selectedMuscle, setSelectedMuscle] = React.useState<{
    id: string;
    name: string;
    volume: number;
    x: number;
    y: number;
  } | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);
  const [muscleSessions, setMuscleSessions] = React.useState<MuscleSession[]>(
    [],
  );
  const [isLoadingSessions, setIsLoadingSessions] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const lastMouseEvent = React.useRef<React.MouseEvent | null>(null);

  const data = useMemo(() => {
    const result: HeatmapData[] = [];
    if (volumeMap && Object.keys(volumeMap).length > 0) {
      const maxScore = Math.max(
        ...Object.values(volumeMap).map((v) => v?.score || 0),
      );

      Object.entries(volumeMap).forEach(([part, dataObj]) => {
        const score = dataObj?.score || 0;
        if (score > 0 && BODY_PART_TO_MUSCLES[part] && maxScore > 0) {
          const intensityLevel = Math.ceil((score / maxScore) * 8);

          result.push({
            name: part,
            muscles: BODY_PART_TO_MUSCLES[part],
            frequency: Math.max(1, intensityLevel),
          });
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result as any;
  }, [volumeMap]);

  const handleMuscleClick = (params: { muscle: string }) => {
    const muscleKey = params.muscle;
    // 명시적인 세부 명칭 매핑에서 먼저 찾고, 없으면 기본 키 사용
    const displayName = MUSCLE_DISPLAY_NAME[muscleKey] || muscleKey;
    const dataObj = volumeMap[displayName] || volumeMap[muscleKey];

    if (dataObj && containerRef.current && lastMouseEvent.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setSelectedMuscle({
        id: muscleKey,
        name: displayName,
        volume: dataObj.volume || 0,
        x: lastMouseEvent.current.clientX - rect.left,
        y: lastMouseEvent.current.clientY - rect.top,
      });
    }
  };

  // Close tooltip when clicking outside
  const handleContainerClick = (e: React.MouseEvent) => {
    // Prevent clearing if clicking on tooltip
    if (e.target === e.currentTarget) {
      setSelectedMuscle(null);
    }
  };

  const handleTooltipClick = async () => {
    if (!selectedMuscle || !startDate || !endDate) return;

    setIsBottomSheetOpen(true);
    setIsLoadingSessions(true);
    try {
      const data = await getMuscleSessions({
        muscleName: selectedMuscle.id,
        startDate,
        endDate,
      });
      setMuscleSessions(data || []);
    } catch (e) {
      console.error(e);
      setMuscleSessions([]);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const heatmapColors = [
    "#dbeafe",
    "#bfdbfe",
    "#93c5fd",
    "#60a5fa",
    "#3b82f6",
    "#2563eb",
    "#1d4ed8",
    "#1e40af",
  ];

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      onMouseMove={(e) => {
        // Store the last mouse event to use its coordinates when a muscle is clicked
        lastMouseEvent.current = e;
      }}
      className="flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 p-6 w-full relative overflow-visible"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center justify-around w-full">
        <div className="flex flex-col items-center">
          <h4 className="text-sm font-bold text-gray-700 mb-4 px-3 py-1 bg-gray-50 rounded-full">
            전면 (Anterior)
          </h4>
          <Model
            data={data}
            type="anterior"
            style={{ width: "12rem", padding: "1rem" }}
            highlightedColors={heatmapColors}
            onClick={handleMuscleClick}
          />
        </div>
        <div className="flex flex-col items-center">
          <h4 className="text-sm font-bold text-gray-700 mb-4 px-3 py-1 bg-gray-50 rounded-full">
            후면 (Posterior)
          </h4>
          <Model
            data={data}
            type="posterior"
            style={{ width: "12rem", padding: "1rem" }}
            highlightedColors={heatmapColors}
            onClick={handleMuscleClick}
          />
        </div>
      </div>

      {/* Floating Tooltip */}
      {selectedMuscle && (
        <div
          onClick={handleTooltipClick}
          className="absolute z-50 transform -translate-x-1/2 -translate-y-full mb-2 bg-white text-black p-3 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200 cursor-pointer hover:scale-105 transition-transform"
          style={{
            left: selectedMuscle.x,
            top: selectedMuscle.y - 10,
          }}
        >
          <div className="flex flex-col items-center whitespace-nowrap">
            <span className="text-xs font-bold text-blue-400 mb-1">
              {selectedMuscle.name}
            </span>
            <span className="text-sm font-bold">
              {selectedMuscle.volume.toLocaleString()} kg
            </span>
          </div>
          {/* Triangle Arrow */}
          <div className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white" />
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center mt-4 text-sm text-gray-500">
          근력 운동 기록이 없습니다. 운동을 시작해보세요!
        </div>
      )}

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title={`${selectedMuscle?.name || ""} 운동 세션 목록`}
      >
        <div className="flex flex-col gap-4 mt-2">
          {isLoadingSessions ? (
            <div className="text-center text-slate-500 py-10">
              세션 정보를 불러오는 중입니다...
            </div>
          ) : muscleSessions.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              해당 근육의 운동 기록이 없습니다.
            </div>
          ) : (
            muscleSessions.map((session) => (
              <div
                key={session.sessionId}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800">
                    {session.sessionDate}
                  </span>
                  <div className="flex gap-3 text-sm">
                    <span className="text-slate-500">
                      볼륨:{" "}
                      <span className="font-semibold text-slate-700">
                        {session.totalVolume.toLocaleString()}kg
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {session.exercises.map((ex, idx) => {
                    // Normalize muscle role to Korean if possible
                    const roleMapping: Record<string, string> = {
                      PRIMARY: "주동근",
                      SECONDARY: "보조근",
                      SYNERGIST: "협응근",
                    };
                    const roleName =
                      roleMapping[ex.muscleRole?.toUpperCase()] ||
                      ex.muscleRole;

                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-white p-2 rounded-xl text-sm shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">
                            {ex.exerciseName}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              roleName === "주동근"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {roleName}
                          </span>
                        </div>
                        <div className="flex gap-2 text-slate-500 text-xs">
                          <span>{ex.volume.toLocaleString()}kg</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </BottomSheet>
    </div>
  );
}
