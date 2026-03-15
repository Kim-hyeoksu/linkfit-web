"use client";

import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: React.ReactNode;
  isDanger?: boolean;
  isLoading?: boolean; // Added for unified support
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  isDanger = false,
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] w-[calc(100%-40px)] max-w-sm bg-white rounded-[32px] p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isDanger ? "bg-red-50 text-red-500" : "bg-blue-50 text-main"}`}>
                <AlertCircle size={32} />
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">
                {title}
              </h3>
              <div className="text-slate-500 font-medium mb-8 leading-relaxed">
                {description}
              </div>

              <div className="flex w-full gap-3">
                <button
                  onClick={() => {
                    if (onCancel) onCancel();
                    onClose();
                  }}
                  disabled={isLoading}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                  }}
                  disabled={isLoading}
                  className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    isDanger 
                      ? "bg-red-500 shadow-red-100 hover:bg-red-600" 
                      : "bg-main shadow-blue-100 hover:bg-blue-600"
                  } disabled:opacity-70`}
                >
                  {isLoading && <Loader2 size={18} className="animate-spin" />}
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
