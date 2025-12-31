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
      {description && <div className="text-sm text-gray-700">{description}</div>}
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          className={`h-[42px] flex-1 rounded-lg ${cancelButtonClassName}`}
          onClick={onClose}
          disabled={isConfirmLoading}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={`h-[42px] flex-1 rounded-lg ${confirmButtonClassName} ${
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

