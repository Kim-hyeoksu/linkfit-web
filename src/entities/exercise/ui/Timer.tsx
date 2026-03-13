"use client";

import React, { useState, useEffect, useRef } from "react";

import Image from "next/image";
import { BottomSheet } from "@/shared";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
export const Timer = ({
  startTrigger,
  restSeconds,
  nextExercise,
  showType = "bar",
  onShowTypeChange,
  onCompleteSet,
  currentExerciseId,
  currentExerciseSetId,
  onStartWorkout,
  isSessionStarted,
}: {
  startTrigger: number;
  restSeconds: number;
  nextExercise: (exerciseId: number) => void;
  showType?: "bar" | "full";
  onShowTypeChange?: (type: "bar" | "full") => void;
  onCompleteSet: (sessionExerciseId: number, sessionSetId: number) => void;
  currentExerciseId: number;
  currentExerciseSetId: number;
  onStartWorkout?: () => void;
  isSessionStarted?: boolean;
}) => {
  const [remainingMs, setRemainingMs] = useState(restSeconds * 1000); // 밀리초
  const [totalMs, setTotalMs] = useState(restSeconds * 1000); // 총 시간
  const [isRunning, setIsRunning] = useState(false);
  const [internalShowType, setInternalShowType] = useState<"full" | "bar">(
    showType,
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);

  const changeShowType = React.useCallback(
    (type: "full" | "bar") => {
      setInternalShowType(type);
      onShowTypeChange?.(type);
    },
    [onShowTypeChange],
  );
  // 타이머 시작
  const startTimer = () => {
    const totalInputMs = restSeconds * 1000;
    if (totalInputMs <= 0) {
      alert("휴식 시간은 0초보다 길게 설정해주세요!");
      return;
    }

    stopTimer();
    setRemainingMs(totalInputMs);
    setTotalMs(totalInputMs);
    setIsRunning(true);
    prevTimeRef.current = performance.now();

    const tick = (now: number) => {
      if (prevTimeRef.current === null) return;
      const delta = now - prevTimeRef.current;
      prevTimeRef.current = now;

      setRemainingMs((prev) => {
        const next = Math.max(prev - delta, 0);

        if (next === 0) {
          // rAF 즉시 취소
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }

          setIsRunning(false);
          sendRestFinishedToRN(
            "휴식 끝! 🤸‍♀️",
            "이제 다음 운동 세트를 시작할 시간이에요!",
          );
        }

        return next;
      });

      // next가 0이 아니면 계속 tick 호출
      if (rafRef.current !== null) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  // 타이머 정지
  const stopTimer = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    prevTimeRef.current = null;
    setIsRunning(false);
  };

  // 타이머 초기화
  const resetTimer = () => {
    startTimer();
  };

  // 남은 시간 변경 버튼 (+/-)
  const changeSeconds = (seconds: number) => {
    setRemainingMs((prev) => {
      const next = Math.max(prev + seconds * 1000, 0);
      // 늘어난 시간이 기존 총 시간보다 커지면, 프로그레스 바를 위해 총 시간도 함께 늘려줍니다.
      setTotalMs((prevTotal) => Math.max(prevTotal, next));
      return next;
    });
  };

  // React Native 메시지 전송
  const sendRestFinishedToRN = (title: string, messageContent: string) => {
    if (
      window.ReactNativeWebView &&
      typeof window.ReactNativeWebView.postMessage === "function"
    ) {
      const message = JSON.stringify({
        type: "TIMER_FINISHED",
        title,
        message: messageContent,
      });
      window.ReactNativeWebView.postMessage(message);
    } else {
      alert(`${title}\n${messageContent}`);
    }
  };

  const lastTriggerRef = useRef(startTrigger);

  useEffect(() => {
    // startTrigger가 0이거나 이전과 같으면 리셋하지 않음 (다른 의존성 변화로 인한 불필요한 리셋 방지)
    if (startTrigger === 0 || startTrigger === lastTriggerRef.current) {
      lastTriggerRef.current = startTrigger;
      return;
    }
    lastTriggerRef.current = startTrigger;

    // 타이머 시작
    const totalInputMs = restSeconds * 1000;
    if (totalInputMs > 0) {
      stopTimer();
      setRemainingMs(totalInputMs);
      setTotalMs(totalInputMs);
      setIsRunning(true);
      prevTimeRef.current = performance.now();

      const tick = (now: number) => {
        if (prevTimeRef.current === null) return;
        const delta = now - prevTimeRef.current;
        prevTimeRef.current = now;

        setRemainingMs((prev) => {
          const next = Math.max(prev - delta, 0);
          if (next === 0) {
            if (rafRef.current) {
              cancelAnimationFrame(rafRef.current);
              rafRef.current = null;
            }
            setIsRunning(false);
            sendRestFinishedToRN(
              "휴식 끝! 🤸‍♀️",
              "이제 다음 운동 세트를 시작할 시간이에요!",
            );
          }
          return next;
        });
        if (rafRef.current !== null)
          rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    setInternalShowType("full");
    onShowTypeChange?.("full");
  }, [startTrigger, restSeconds, onShowTypeChange]);
  // 언마운트 시 rAF 정리
  useEffect(() => {
    return () => stopTimer();
  }, []);

  // 남은 시간 mm:ss 변환
  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  };

  const handleWrapperClick = () => {
    if (internalShowType === "bar") {
      changeShowType("full");
    }
  };

  return (
    <div
      ref={wrapperRef}
      onClick={handleWrapperClick}
      className="transition-all duration-500 ease-in-out"
    >
      {internalShowType === "bar" && (
        <div className="fixed bottom-4 left-4 right-4 backdrop-blur-xl bg-white/80 border border-slate-200/50 flex h-[72px] items-center justify-between px-5 z-[100] gap-[16px] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-in slide-in-from-bottom-5 transition-all active:scale-95 cursor-pointer">
          <div
            className={`text-[16px] font-black h-[44px] w-[100px] rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
              isRunning
                ? "bg-main text-white shadow-blue-200 ring-4 ring-blue-50"
                : "bg-slate-100 text-slate-400 border border-slate-100"
            }`}
          >
            {isRunning ? (
              formatTime(remainingMs)
            ) : (
              <Image
                src="/images/common/icon/access_alarm_24px.svg"
                width={22}
                height={22}
                alt="휴식"
                className="opacity-40"
              />
            )}
          </div>
          {!isSessionStarted ? (
            <button
              className="flex-1 h-[44px] flex items-center justify-center rounded-2xl bg-main text-white font-black text-[15px] shadow-sm shadow-blue-100 hover:shadow-md transition-all active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                onStartWorkout?.();
              }}
            >
              운동 시작
            </button>
          ) : isRunning ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                stopTimer();
                setRemainingMs(0);
              }}
              className="flex-1 h-[44px] flex items-center justify-center rounded-2xl bg-slate-100 text-slate-600 font-bold text-[14px] hover:bg-slate-200 transition-all active:scale-95"
            >
              타이머 스킵
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompleteSet(currentExerciseId, currentExerciseSetId);
              }}
              className="flex-1 h-[44px] flex items-center justify-center rounded-2xl bg-main text-white font-black text-[15px] shadow-sm shadow-blue-100 hover:shadow-md transition-all active:scale-95"
            >
              현재 세트 완료
            </button>
          )}
        </div>
      )}

      <BottomSheet
        isOpen={internalShowType === "full"}
        onClose={() => changeShowType("bar")}
        hideHeader
        backdropClassName="backdrop-blur-none"
      >
        <div className="flex flex-col w-full h-[360px] justify-between items-center pt-2">
          {/* +/- 버튼 */}
          <div className="w-full flex justify-between px-4 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                changeSeconds(-10);
              }}
              className="flex justify-center items-center px-4 h-10 bg-slate-50 text-slate-600 font-bold rounded-xl border border-slate-100 hover:bg-slate-100 transition-all active:scale-90"
            >
              -10s
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                changeSeconds(10);
              }}
              className="flex justify-center items-center px-4 h-10 bg-slate-50 text-slate-600 font-bold rounded-xl border border-slate-100 hover:bg-slate-100 transition-all active:scale-90"
            >
              +10s
            </button>
          </div>

          {/* 원형 프로그레스바 */}
          <div className="relative flex justify-center items-center">
            <div
              className="flex justify-center items-center rounded-full w-[180px] h-[180px] transition-all duration-300"
              style={{
                background: `conic-gradient(
                  #0ea5e9 ${(remainingMs / (totalMs || 1)) * 100}%,
                  #f1f5f9 ${(remainingMs / (totalMs || 1)) * 100}% 100%
                )`,
                boxShadow:
                  "inset 0 0 20px rgba(0,0,0,0.02), 0 10px 30px rgba(14, 165, 233, 0.1)",
              }}
            >
              <div className="rounded-full bg-white flex flex-col justify-center items-center w-[150px] h-[150px] shadow-inner">
                <span className="text-[40px] font-black text-slate-800 tracking-tighter tabular-nums drop-shadow-sm">
                  {formatTime(remainingMs)}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
                  RESTING
                </span>
              </div>
            </div>
          </div>

          {/* 리셋 및 컨트롤 버튼 */}
          <div className="w-full flex gap-4 px-4 pb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetTimer();
              }}
              className="flex items-center justify-center rounded-2xl bg-slate-100 w-[70px] h-[52px] hover:bg-slate-200 transition-all active:scale-95 group"
            >
              <Image
                src="/images/common/icon/reset.svg"
                width={24}
                height={24}
                alt="리셋"
                className="opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                stopTimer();
                setRemainingMs(0);
                changeShowType("bar");
              }}
              className="flex-1 h-[52px] flex items-center justify-center rounded-2xl bg-[#eff6ff] text-main font-black text-[16px] border border-blue-50 hover:bg-main hover:text-white transition-all active:scale-95 shadow-sm shadow-blue-50"
            >
              타이머 스킵
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default Timer;
