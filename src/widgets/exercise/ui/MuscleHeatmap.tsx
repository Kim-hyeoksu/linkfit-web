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
  volumeMap: Record<string, number>;
}

// Map linkfit Korean body parts to react-body-highlighter muscles
const BODY_PART_TO_MUSCLES: Record<string, string[]> = {
  // 대분류 (기존 유지)
  가슴: ["chest"],
  Chest: ["chest"],
  chest: ["chest"],
  등: ["upper-back", "lower-back", "trapezius"],
  Back: ["upper-back", "lower-back", "trapezius"],
  back: ["upper-back", "lower-back", "trapezius"],
  하체: [
    "hamstring",
    "quadriceps",
    "gluteal",
    "calves",
    "adductor",
    "abductors",
  ],
  Legs: [
    "hamstring",
    "quadriceps",
    "gluteal",
    "calves",
    "adductor",
    "abductors",
  ],
  legs: [
    "hamstring",
    "quadriceps",
    "gluteal",
    "calves",
    "adductor",
    "abductors",
  ],
  어깨: ["front-deltoids", "back-deltoids"],
  Shoulders: ["front-deltoids", "back-deltoids"],
  shoulders: ["front-deltoids", "back-deltoids"],
  deltoids: ["front-deltoids", "back-deltoids"],
  팔: ["biceps", "triceps", "forearm"],
  Arms: ["biceps", "triceps", "forearm"],
  arms: ["biceps", "triceps", "forearm"],
  코어: ["abs", "obliques"],
  Core: ["abs", "obliques"],
  core: ["abs", "obliques"],

  // 세부 부위 (추가)
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
};

export function MuscleHeatmap({ volumeMap }: MuscleHeatmapProps) {
  const data = useMemo(() => {
    const result: HeatmapData[] = [];
    if (volumeMap) {
      // 1. 가장 운동 볼륨이 높은 부위의 값을 찾음 (기준점)
      const maxVolume = Math.max(
        ...Object.values(volumeMap).map((v) => v || 0),
      );

      Object.entries(volumeMap).forEach(([part, volume]) => {
        if (volume > 0 && BODY_PART_TO_MUSCLES[part] && maxVolume > 0) {
          // 2. 최대 볼륨 대비 해당 부위의 비율로 1~8(색상 단계) 사이의 레벨 계산
          const intensityLevel = Math.ceil((volume / maxVolume) * 8);

          result.push({
            name: part,
            muscles: BODY_PART_TO_MUSCLES[part],
            frequency: Math.max(1, intensityLevel),
          });
        }
      });
    }

    return result as any; // Cast as any because Model prop types might be strict
  }, [volumeMap]);

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
