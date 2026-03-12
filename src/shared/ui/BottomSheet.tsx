"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
  showBackdrop?: boolean;
  backdropClassName?: string;
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
}) => {
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
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              // 100px 이상 내려가거나, 빠르게 내리면 닫기
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className={`
              fixed bottom-0 left-0 right-0 z-[160]
              bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]
              max-w-2xl mx-auto w-full
              flex flex-col
              ${className}
            `}
          >
            {/* Drag Handle Indicator */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 opacity-50 shrink-0" />

            {!hideHeader && (
              <div className="flex justify-between items-center px-6 pt-2 pb-4 shrink-0">
                <h2 className="text-[20px] font-black text-slate-800 leading-tight tracking-tight">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all active:scale-95"
                >
                  <X size={24} strokeWidth={2.5} />
                </button>
              </div>
            )}

            <div className="flex-grow overflow-y-auto px-6 pb-10">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
