"use client";

import { useState, useRef, useEffect } from "react";
import { Program } from "@/entities/program";
import { ProgramCard } from "@/entities/program";
import Link from "next/link";
import { Info } from "lucide-react";

interface ProgramListProps {
  programs: Program[];
  title: string;
  moreLink?: string;
  addLink?: string;
  emptyMessage?: string;
  emptyButtonLabel?: string;
  helpMessage?: string;
}

export const ProgramList = ({
  programs,
  title,
  moreLink,
  addLink,
  emptyMessage = "아직 항목이 없어요",
  emptyButtonLabel = "첫 번째 항목 만들기",
  helpMessage,
}: ProgramListProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setShowHelp(false);
      }
    };
    if (showHelp) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHelp]);

  const TitleWithHelp = () => (
    <div className="flex items-center gap-1.5 relative px-1" ref={helpRef}>
      {helpMessage && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowHelp((prev) => !prev);
          }}
          className="text-slate-300 hover:text-slate-500 transition-colors flex items-center justify-center p-0.5"
        >
          <Info size={18} />
        </button>
      )}
      <h2 className="text-[19px] font-bold text-slate-800 tracking-tight">
        {title}
      </h2>
      {showHelp && helpMessage && (
        <div className="absolute top-10 left-0 w-[240px] px-3.5 py-2.5 bg-slate-800 text-white text-[13px] leading-relaxed font-medium rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-800 transform rotate-45 rounded-sm" />
          <span className="relative z-10">{helpMessage}</span>
        </div>
      )}
    </div>
  );

  if (programs.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <TitleWithHelp />
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-100 rounded-2xl gap-3">
          <p className="text-sm text-slate-500 font-medium">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <TitleWithHelp />
        </div>
        {moreLink && (
          <Link
            href={moreLink!}
            className="text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-0.5"
          >
            더보기
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-[14px]">
        {programs.map((program) => (
          <ProgramCard key={program.id} {...program} />
        ))}
      </div>
    </div>
  );
};
