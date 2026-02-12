"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { importProgram } from "@/entities/program";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";

interface Props {
  programId: number;
}

export const ImportProgramButton = ({ programId }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmImport = async () => {
    setIsLoading(true);
    try {
      await importProgram(programId, 1);
      setIsModalOpen(false);
      // 성공 피드백은 일단 간단히 처리하거나 추후 Toast로 교체 추천
      alert("성공적으로 추가되었습니다!");
      router.push("/workout/programs/mine");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("프로그램 추가에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[100] w-full max-w-xl mx-auto px-5 pointer-events-none">
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          className="pointer-events-auto h-[56px] w-full mb-24 flex items-center justify-center gap-2 bg-main text-white rounded-2xl font-bold text-[16px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
        >
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
        </button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmImport}
        title="프로그램 가져오기"
        description="이 운동 프로그램을 나의 루틴으로 가져오시겠습니까?"
        confirmText="가져오기"
        isConfirmLoading={isLoading}
      />
    </>
  );
};
