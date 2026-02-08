"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAtomValue } from "jotai";
import { sessionStateAtom, sessionReturnUrlAtom } from "@/entities/session";

// Simple formatter if not imported
const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const ActiveSessionFAB = () => {
  const router = useRouter();
  const pathname = usePathname();
  const sessionState = useAtomValue(sessionStateAtom);
  const returnUrl = useAtomValue(sessionReturnUrlAtom);

  const [elapsedMs, setElapsedMs] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show only if session is active AND we are NOT on the session page
    // Also ignore if returnUrl is null
    if (sessionState.isSessionStarted && returnUrl && pathname !== returnUrl) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [sessionState.isSessionStarted, pathname, returnUrl]);

  useEffect(() => {
    if (!isVisible || !sessionState.startedAt) return;

    // Immediate update
    const updateTime = () => {
      const diff = Date.now() - new Date(sessionState.startedAt!).getTime();
      setElapsedMs(Math.max(diff, 0));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [isVisible, sessionState.startedAt]);

  const handleClick = () => {
    if (returnUrl) router.push(returnUrl);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-[80px] right-5 z-[100] w-[64px] h-[64px] rounded-full bg-slate-900 border-2 border-slate-800 text-white shadow-xl shadow-slate-300/50 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 animate-in zoom-in slide-in-from-bottom-5 duration-300"
    >
      <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-main pointer-events-none" />
      <span className="text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-wider">
        RUNNING
      </span>
      <span className="text-[14px] font-black tabular-nums tracking-tight text-white leading-none">
        {formatTime(elapsedMs)}
      </span>
    </button>
  );
};
