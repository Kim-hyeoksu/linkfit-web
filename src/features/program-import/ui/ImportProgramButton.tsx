"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { importProgram } from "@/entities/program";

interface Props {
  programId: number;
}

export const ImportProgramButton = ({ programId }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (confirm("이 프로그램을 내 운동 루틴으로 가져오시겠습니까?")) {
      setIsLoading(true);
      try {
        await importProgram(programId);
        alert("성공적으로 추가되었습니다!");
        router.push("/workout/programs/mine"); // 내 루틴 목록으로 이동
        router.refresh(); // 데이터 갱신
      } catch (error) {
        console.error(error);
        alert("프로그램 추가에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 w-full max-w-xl mx-auto px-5 pointer-events-none">
      <button
        onClick={handleImport}
        disabled={isLoading}
        className="pointer-events-auto h-[56px] w-full mb-24 flex items-center justify-center gap-2 bg-main text-white rounded-2xl font-bold text-[16px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            가져오는 중...
          </span>
        ) : (
          <>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            내 루틴으로 가져오기
          </>
        )}
      </button>
    </div>
  );
};
