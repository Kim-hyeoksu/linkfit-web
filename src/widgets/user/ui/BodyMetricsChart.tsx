"use client";

import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import "hammerjs";
import { BodyMetric } from "@/entities/user/model/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
);

export const BodyMetricsChart = ({
  data,
  activeMetrics = ["weight", "skeletalMuscleMass", "bodyFatPercentage"],
  hideUnitLabels = false,
}: {
  data: BodyMetric[];
  activeMetrics?: string[];
  hideUnitLabels?: boolean;
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="py-8 h-64 flex items-center justify-center text-center text-gray-500 text-sm">
        기록된 변화 추이가 없어요.
      </div>
    );
  }

  // 데이터 날짜순 정렬
  const sortedData = [...data].sort(
    (a, b) =>
      new Date(a.measuredDate).getTime() - new Date(b.measuredDate).getTime(),
  );

  const labels = sortedData.map((tick) => {
    const date = new Date(tick.measuredDate);
    return `${date.getMonth() + 1}.${date.getDate()}`;
  });

  const datasets = [];

  if (activeMetrics.includes("weight")) {
    datasets.push({
      label: "체중(kg)",
      data: sortedData.map((d) => d.weight),
      borderColor: "#3b82f6",
      backgroundColor: "#3b82f6",
      yAxisID: "y-weight",
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: "#3b82f6",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      tension: 0.1,
    });
  }

  if (activeMetrics.includes("skeletalMuscleMass")) {
    datasets.push({
      label: "골격근량(kg)",
      data: sortedData.map((d) => d.skeletalMuscleMass || null),
      borderColor: "#ef4444",
      backgroundColor: "#ef4444",
      yAxisID: "y-weight",
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: "#ef4444",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      tension: 0.1,
      spanGaps: true,
    });
  }

  if (activeMetrics.includes("bodyFatPercentage")) {
    datasets.push({
      label: "체지방률(%)",
      data: sortedData.map((d) => d.bodyFatPercentage || null),
      borderColor: "#10b981",
      backgroundColor: "#10b981",
      yAxisID: "y-percent",
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: "#10b981",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      tension: 0.1,
      spanGaps: true,
    });
  }

  const chartData = {
    labels,
    datasets,
  };

  const hasWeightAxis =
    activeMetrics.includes("weight") ||
    activeMetrics.includes("skeletalMuscleMass");
  const hasPercentAxis = activeMetrics.includes("bodyFatPercentage");

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 10,
        bottom: 0,
      },
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
            size: 10,
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
            const itemDate = sortedData[index]?.measuredDate;
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
          modifierKey: "ctrl", // For desktop panning without scroll conflicts (if needed)
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
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
      "y-weight": {
        type: "linear",
        display: hasWeightAxis,
        position: "left",
        grid: {
          color: "#f1f5f9",
          drawTicks: false,
        },
        border: {
          display: false,
          dash: [3, 3],
        },
        ticks: {
          color: "#9ca3af",
          font: { family: "sans-serif", size: 10 },
          padding: 10,
        },
      },
      "y-percent": {
        type: "linear",
        display: hasPercentAxis,
        position: "right",
        grid: {
          drawOnChartArea: false, // 오른쪽 축 그리드는 안 그림 (겹침 방지)
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: { family: "sans-serif", size: 10 },
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="w-full h-full text-xs font-sans flex flex-col pt-2">
      {!hideUnitLabels && (
        <div className="flex justify-between text-[10px] text-gray-400 px-2 z-10 w-full mb-1">
          {hasWeightAxis && <span>단위: kg</span>}
          {hasPercentAxis && <span className="ml-auto">단위: %</span>}
        </div>
      )}
      <div className="flex-1 w-full relative h-[250px] min-h-[200px]">
        <Line data={chartData} options={options} />
      </div>
      <div className="text-center text-[10px] text-gray-400 mt-2">
        손가락으로 벌려 확대(Pinch) 하거나 좌우로 밀어(Pan) 볼 수 있습니다.
      </div>
    </div>
  );
};
