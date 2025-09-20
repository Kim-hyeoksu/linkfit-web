"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
}: {
  startTrigger: number;
  restSeconds: number | undefined;
  nextExercise: () => void;
  showType?: "bar" | "full";
  onShowTypeChange?: (type: "bar" | "full") => void;
}) => {
  const isFirstRender = useRef(true);

  const [remainingMs, setRemainingMs] = useState(restSeconds * 1000); // 밀리초
  const [totalMs, setTotalMs] = useState(restSeconds * 1000); // 총 시간
  const [isRunning, setIsRunning] = useState(false);
  const [internalShowType, setInternalShowType] = useState<"full" | "bar">(
    showType
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);

  const changeShowType = (type: "full" | "bar") => {
    setInternalShowType(type);
    onShowTypeChange?.(type);
  };
  // 타이머 시작
  const startTimer = () => {
    const totalInputMs = restSeconds * 1000;
    if (totalInputMs <= 0) {
      alert("휴식 시간은 0초보다 길게 설정해주세요!");
      console.log("test");
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
            "이제 다음 운동 세트를 시작할 시간이에요!"
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
    stopTimer();
    const initialMs = restSeconds; // 기본 5초
    setRemainingMs(initialMs);
    setTotalMs(initialMs);
  };

  // 남은 시간 변경 버튼 (+/-)
  const changeSeconds = (seconds: number) => {
    setRemainingMs((prev) => {
      const next = Math.max(prev + seconds * 1000, 0);
      // totalMs보다 크면 totalMs로 제한
      return Math.min(next, totalMs);
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

  useEffect(() => {
    console.log("restSeconds changed", restSeconds);
    if (startTrigger === 0) return;
    startTimer();
    changeShowType("full");
  }, [startTrigger]);
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
      "0"
    )}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // wrapperRef 영역 안이면 클릭 무시
      // contains 메소드는 Node || null 타입을 받지만 event.target의 타입은 EventTarget
      // 따라서 Node로 타입 단언
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        changeShowType("bar"); // 선택 초기화 → Timer 숨김
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      onClick={() =>
        changeShowType(internalShowType === "bar" ? "full" : "bar")
      }
    >
      {internalShowType === "bar" ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#d9d9d9] flex h-[72px] pt-2 justify-between px-5 z-50 gap-[20px] pb-5">
          <div className="text-lg font-bold h-[42px] w-[93px] bg-[#0ea5e9] text-white rounded-lg flex items-center justify-center">
            {formatTime(remainingMs)}
          </div>
          {startTrigger === 0 && (
            <button
              onClick={nextExercise}
              className="flex items-center justify-center rounded-lg h-[42px] bg-[#0ea5e9] text-white "
              style={{ flex: 1 }}
            >
              세트 완료
            </button>
          )}
          {/* <button
            onClick={nextExercise}
            className="flex items-center justify-center rounded-lg h-[42px] border border-[#d9d9d9]"
            style={{ flex: 1 }}
          >
            다음 운동
          </button> */}
        </div>
      ) : (
        <div className="flex flex-col w-full px-5 h-[375px] min-h-[375px] justify-between items-center fixed bottom-0 bg-white left-0 right-0 pt-5 z-50 border-t border-[#d9d9d9]">
          {/* +/- 버튼 */}
          <div className="w-full flex justify-between">
            <button
              onClick={() => changeSeconds(-10)}
              className="flex justify-center items-center w-[37px] h-[33px] border border-[#d9d9d9] rounded-[8px]"
            >
              -10s
            </button>
            <button
              onClick={() => changeSeconds(10)}
              className="flex justify-center items-center w-[37px] h-[33px] border border-[#d9d9d9] rounded-[8px]"
            >
              +10s
            </button>
          </div>

          {/* 원형 프로그레스바 */}
          <div
            className="flex justify-center items-center rounded-full w-[198px] h-[198px]"
            style={{
              background: `conic-gradient(
            #0EA5E9 ${(remainingMs / totalMs) * 100}%,
            #d9d9d9 ${(remainingMs / totalMs) * 100}% 100%
          )`,
            }}
          >
            <div className="rounded-full bg-white flex justify-center items-center w-[180px] h-[180px] text-[40px] font-bold">
              {formatTime(remainingMs)}
            </div>
          </div>

          {/* 입력창
      {!isRunning && remainingMs === 0 && (
        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <input
            type="number"
            value={inputMinutes}
            onChange={(e) =>
              setInputMinutes(
                e.target.value.startsWith("-") ? "0" : e.target.value
              )
            }
            placeholder="분"
            min="0"
            style={inputStyle}
          />
          <span
            style={{ fontSize: "1.5em", fontWeight: "bold", color: "#555" }}
          >
            분
          </span>
          <input
            type="number"
            value={inputSeconds}
            onChange={(e) => {
              const parsed = parseInt(e.target.value);
              if (isNaN(parsed) || parsed < 0) setInputSeconds("0");
              else if (parsed > 59) setInputSeconds("59");
              else setInputSeconds(e.target.value);
            }}
            placeholder="초"
            min="0"
            max="59"
            style={inputStyle}
          />
          <span
            style={{ fontSize: "1.5em", fontWeight: "bold", color: "#555" }}
          >
            초
          </span>
        </div>
      )} */}

          {/* 리셋 버튼 */}
          <div
            className="w-full"
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={resetTimer}
              className="flex items-center justify-center rounded-lg bg-[#0EA5E9] w-[93px] h-[42px]"
            >
              <Image
                src="/images/common/icon/reset.svg"
                width={24}
                height={24}
                alt="리셋"
              />
            </button>
            <button
              onClick={nextExercise}
              className="flex items-center justify-center rounded-lg h-[42px] border border-[#d9d9d9]"
              style={{ flex: 1 }}
            >
              다음 운동
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "10px 15px",
  fontSize: "1.2em",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "80px",
  textAlign: "center",
  outline: "none",
  transition: "border-color 0.3s ease",
};

export default Timer;
