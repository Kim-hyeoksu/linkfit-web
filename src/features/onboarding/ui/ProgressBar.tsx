"use client";

import { motion } from "framer-motion";

interface Props {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: Props) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-1.5 bg-slate-100/50 mt-1 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="h-full bg-main rounded-full"
      />
    </div>
  );
};
