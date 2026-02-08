"use client";

import React from "react";
import { Modal } from "./Modal";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  isConfirmLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  hideCloseButton?: boolean;
};

export const ConfirmModal = ({
  isOpen,
  title = "확인",
  description,
  confirmText = "확인",
  cancelText = "취소",
  confirmButtonClassName = "bg-main text-white",
  cancelButtonClassName = "bg-light-gray text-dark-gray",
  isConfirmLoading = false,
  onConfirm,
  onClose,
  hideCloseButton = true,
}: ConfirmModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      hideCloseButton={hideCloseButton}
      className="max-w-[360px]"
    >
      {description && <div className="text-[15px] font-medium text-slate-500 leading-relaxed mb-8">{description}</div>}
      <div className="flex gap-3 mt-8">
        <button
          type="button"
          className={`h-12 flex-1 rounded-2xl font-bold text-[14px] transition-all active:scale-95 bg-slate-100 text-slate-500 hover:bg-slate-200 ${cancelButtonClassName}`}
          onClick={onClose}
          disabled={isConfirmLoading}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={`h-12 flex-1 rounded-2xl font-black text-[14px] transition-all active:scale-95 bg-main text-white shadow-sm shadow-blue-100 hover:shadow-md ${confirmButtonClassName} ${
            isConfirmLoading ? "opacity-60" : ""
          }`}
          onClick={onConfirm}
          disabled={isConfirmLoading}
        >
          {isConfirmLoading ? "처리 중..." : confirmText}
        </button>
      </div>
    </Modal>
  );
};

