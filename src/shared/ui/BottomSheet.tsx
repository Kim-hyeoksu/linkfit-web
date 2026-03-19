"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
  showBackdrop?: boolean;
  backdropClassName?: string;
  maxHeight?: string; // 높이 조절 가능하도록 추가
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  hideHeader = false,
  showBackdrop = true,
  backdropClassName = "",
  maxHeight = "h-[94vh]", // 기본값 94%
}) => {
  const dragControls = useDragControls();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {showBackdrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
              className={`fixed inset-0 z-[150] bg-slate-900/40 ${backdropClassName || "backdrop-blur-[2px]"}`}
            />
          )}
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false} // 핸들로만 드래그 허용
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 150 || info.velocity.y > 600) {
                onClose();
              }
            }}
            className={`
              fixed bottom-0 left-0 right-0 z-[160]
              bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]
              max-w-2xl mx-auto w-full overflow-hidden
              flex flex-col ${maxHeight}
              ${className}
            `}
          >
            {/* Drag Handle & Header Section (Draggable Area) */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="pt-4 pb-2 cursor-grab active:cursor-grabbing shrink-0 touch-none"
            >
              {/* Drag Handle Indicator */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2 opacity-50" />

              {!hideHeader && (
                <div className="px-6 pt-4 pb-2">
                  <h2 className="text-[20px] font-black text-slate-800 leading-tight tracking-tight">
                    {title}
                  </h2>
                </div>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-grow overflow-y-auto px-5 pb-5 touch-pan-y">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
