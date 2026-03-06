"use client";

import React, { useMemo } from "react";
import Model from "react-body-highlighter";
import { ActiveSessionDto } from "@/entities/session";

// Define our own IExerciseData since Model exports it, but just in case
interface HeatmapData {
  name: string;
  muscles: string[];
  frequency: number;
}

interface MuscleHeatmapProps {
  sessions: ActiveSessionDto[];
}

// Map linkfit Korean body parts to react-body-highlighter muscles
const BODY_PART_TO_MUSCLES: Record<string, string[]> = {
  가슴: ["chest"],
  등: ["upper-back", "lower-back", "trapezius"],
  하체: [
    "hamstring",
    "quadriceps",
    "gluteal",
    "calves",
    "adductor",
    "abductors",
  ],
  어깨: ["front-deltoids", "back-deltoids"],
  팔: ["biceps", "triceps", "forearm"],
  코어: ["abs", "obliques"],
};

export function MuscleHeatmap({ sessions }: MuscleHeatmapProps) {
  const data = useMemo(() => {
    const volumeMap: Record<string, number> = {};

    sessions?.forEach((session) => {
      session.exercises?.forEach((ex) => {
        let exerciseVolume = 0;
        ex.sets?.forEach((set: any) => {
          // Calculate volume for completed sets only
          if (
            set.status === "COMPLETED" ||
            set.status === "IN_PROGRESS" ||
            !!set.completedAt
          ) {
            exerciseVolume +=
              (set.actualWeight || set.weight || 0) *
              (set.actualReps || set.reps || 0);
          }
        });

        const part = ex.bodyPart;
        if (part) {
          volumeMap[part] = (volumeMap[part] || 0) + exerciseVolume;
        }
      });
    });

    const result: HeatmapData[] = [];
    Object.entries(volumeMap).forEach(([part, volume]) => {
      if (volume > 0 && BODY_PART_TO_MUSCLES[part]) {
        result.push({
          name: part,
          muscles: BODY_PART_TO_MUSCLES[part],
          frequency: volume,
        });
      }
    });

    return result as any; // Cast as any because Model prop types might be strict
  }, [sessions]);

  // LinkFit Blue color scale for heatmap (from light to dark)
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
    <div className="flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 p-6 w-full">
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
          />
        </div>
      </div>

      {data.length === 0 && (
        <div className="text-center mt-4 text-sm text-gray-500">
          근력 운동 기록이 없습니다. 운동을 시작해보세요!
        </div>
      )}
    </div>
  );
}
