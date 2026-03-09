"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import "hammerjs";
import { ExerciseHistoryResponse } from "@/entities/exercise/model/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
);

export const ExerciseHistoryChart = ({
  data,
}: {
  data: ExerciseHistoryResponse[];
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="py-8 h-64 flex items-center justify-center text-center text-gray-500 text-sm bg-white rounded-3xl border border-gray-100 shadow-sm">
        이 운동에 대한 기록이 아직 없어요.
      </div>
    );
  }

  // 데이터 날짜순 오름차순
  const sortedData = [...data]
    .filter((d) => d.sessionDate)
    .sort(
      (a, b) =>
        new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime(),
    );

  const labels = sortedData.map((d) => {
    const date = new Date(d.sessionDate);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: "추정 1RM(kg)",
        data: sortedData.map((d) => d.calculated1Rm || null),
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        yAxisID: "y-1rm",
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.1,
        spanGaps: true,
      },
      {
        type: "bar" as const,
        label: "총 볼륨(kg)",
        data: sortedData.map((d) => d.totalVolume || 0),
        backgroundColor: "rgba(59, 130, 246, 0.4)",
        borderColor: "rgba(59, 130, 246, 0.8)",
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: "y-volume",
      },
    ],
  };

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    layout: {
      padding: { left: 0, right: 0, top: 10, bottom: 0 },
    },
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          font: {
            size: 11,
            family: "sans-serif",
          },
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        titleFont: {
          family: "sans-serif",
          size: 13,
          weight: "bold",
        },
        bodyFont: {
          family: "sans-serif",
          size: 12,
        },
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const itemDate = sortedData[index]?.sessionDate;
            if (!itemDate) return "";
            const date = new Date(itemDate);
            return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: { family: "sans-serif", size: 10 },
          maxRotation: 0,
        },
        border: {
          display: false,
        },
      },
      "y-1rm": {
        type: "linear",
        position: "right",
        grid: {
          color: "#f1f5f9",
          drawTicks: false,
        },
        border: {
          display: false,
          dash: [3, 3],
        },
        ticks: {
          color: "#ef4444",
          font: { family: "sans-serif", size: 10 },
          padding: 5,
        },
      },
      "y-volume": {
        type: "linear",
        position: "left",
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#3b82f6",
          font: { family: "sans-serif", size: 10 },
          padding: 5,
        },
      },
    },
  };

  return (
    <div className="w-full h-full text-xs font-sans flex flex-col pt-2 bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start text-[10px] px-1 mt-2">
        <div className="flex flex-col text-[#3b82f6] font-bold leading-tight">
          <span>볼륨</span>
          <span>(kg)</span>
        </div>
        <div className="flex flex-col items-end text-[#ef4444] font-bold leading-tight">
          <span>1RM</span>
          <span>(kg)</span>
        </div>
      </div>
      <div className="flex-1 w-full relative h-[300px] min-h-[250px]">
        <Chart
          type="bar"
          data={chartData as unknown as ChartData}
          options={options as unknown as ChartOptions}
        />
      </div>
      <div className="text-center text-[10px] text-gray-400 mt-2">
        손가락으로 벌려 확대(Pinch) 하거나 밀어볼(Pan) 수 있습니다.
      </div>
    </div>
  );
};
