"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared";
import { useToast } from "@/shared/ui/toast/ToastProvider";
import { getLatestBodyMetric } from "@/entities/user/api/getLatestBodyMetric";
import { saveBodyMetric } from "@/entities/user/api/saveBodyMetric";

export default function AddBodyMetricsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const today = new Date().toISOString().split("T")[0];

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    measuredDate: today,
    height: "",
    weight: "",
    skeletalMuscleMass: "",
    bodyFatPercentage: "",
  });

  useEffect(() => {
    const fetchMetric = async () => {
      try {
        const metric = await getLatestBodyMetric();
        if (metric) {
          setFormData((prev) => ({
            ...prev,
            height: metric.height.toString(),
            weight: metric.weight.toString(),
            skeletalMuscleMass: metric.skeletalMuscleMass
              ? metric.skeletalMuscleMass.toString()
              : "",
            bodyFatPercentage: metric.bodyFatPercentage
              ? metric.bodyFatPercentage.toString()
              : "",
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetric();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== "measuredDate" && value && !/^\d*\.?\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.height || !formData.weight) {
      showToast("키와 몸무게는 필수 입력 항목입니다.", "error");
      return;
    }

    const requestData = {
      measuredDate: formData.measuredDate,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      skeletalMuscleMass: formData.skeletalMuscleMass
        ? parseFloat(formData.skeletalMuscleMass)
        : undefined,
      bodyFatPercentage: formData.bodyFatPercentage
        ? parseFloat(formData.bodyFatPercentage)
        : undefined,
    };

    const result = await saveBodyMetric(requestData);
    if (result) {
      showToast("오늘의 신체 기록이 저장되었습니다!", "success");
      router.push("/mypage");
    } else {
      showToast("기록 저장 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="신체 기록" showBackButton={true} />

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
        </div>
      ) : (
        <main className="flex-1 px-6 pt-8 pb-32 overflow-y-auto">
          <form
            id="body-metrics-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
          >
            {/* 상단: 측정 날짜 (타이틀처럼 크게 표시) */}
            <div className="flex flex-col gap-1 border-b border-gray-100 pb-6">
              <label className="text-sm font-medium text-gray-400">
                측정 날짜
              </label>
              <input
                type="date"
                name="measuredDate"
                value={formData.measuredDate}
                onChange={handleChange}
                max={today}
                className="text-2xl font-bold text-gray-900 focus:outline-none bg-transparent"
              />
            </div>

            {/* 핵심 지표: 밑줄 & 우측 정렬 대문짝 폰트 */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-gray-800">기본 정보</h3>

              <div className="flex items-end justify-between border-b border-gray-200 pb-2 focus-within:border-main transition-colors">
                <span className="text-gray-600 font-medium pb-2">몸무게</span>
                <div className="flex items-end gap-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    name="weight"
                    placeholder="0.0"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-24 text-right text-3xl font-bold text-main focus:outline-none bg-transparent placeholder-gray-300"
                  />
                  <span className="text-gray-400 font-medium pb-1">kg</span>
                </div>
              </div>

              <div className="flex items-end justify-between border-b border-gray-200 pb-2 focus-within:border-main transition-colors">
                <span className="text-gray-600 font-medium pb-2">키</span>
                <div className="flex items-end gap-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    name="height"
                    placeholder="0.0"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-24 text-right text-3xl font-bold text-main focus:outline-none bg-transparent placeholder-gray-300"
                  />
                  <span className="text-gray-400 font-medium pb-1">cm</span>
                </div>
              </div>
            </div>

            {/* 상세 지표: 인바디 */}
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-800">상세 체성분</h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-semibold tracking-tight">
                  선택
                </span>
              </div>

              <div className="flex items-end justify-between border-b border-gray-200 pb-2 focus-within:border-main transition-colors">
                <span className="text-gray-600 font-medium pb-2">골격근량</span>
                <div className="flex items-end gap-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    name="skeletalMuscleMass"
                    placeholder="0.0"
                    value={formData.skeletalMuscleMass}
                    onChange={handleChange}
                    className="w-28 text-right text-2xl font-bold text-gray-800 focus:outline-none bg-transparent placeholder-gray-300"
                  />
                  <span className="text-gray-400 font-medium pb-1">kg</span>
                </div>
              </div>

              <div className="flex items-end justify-between border-b border-gray-200 pb-2 focus-within:border-main transition-colors">
                <span className="text-gray-600 font-medium pb-2">체지방률</span>
                <div className="flex items-end gap-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    name="bodyFatPercentage"
                    placeholder="0.0"
                    value={formData.bodyFatPercentage}
                    onChange={handleChange}
                    className="w-28 text-right text-2xl font-bold text-gray-800 focus:outline-none bg-transparent placeholder-gray-300"
                  />
                  <span className="text-gray-400 font-medium pb-1">%</span>
                </div>
              </div>
            </div>
          </form>
        </main>
      )}

      {/* 끈끈이 버튼: 블랙 톤으로 프리미엄 느낌 강조 */}
      {!isLoading && (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white/90 to-transparent pb-8">
          <button
            type="submit"
            form="body-metrics-form"
            className="w-full bg-main text-white py-4 rounded-xl font-bold text-[17px] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:active:scale-100"
            disabled={!formData.weight || !formData.height}
          >
            기록 완료
          </button>
        </div>
      )}
    </div>
  );
}
