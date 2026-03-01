"use client";

import { motion } from "framer-motion";
import React from "react";

interface StepLayoutProps {
  children: React.ReactNode;
}

export const StepLayout = ({ children }: StepLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col absolute inset-0 w-full max-w-xl mx-auto px-5 pt-8 pb-10 overflow-y-auto"
    >
      {children}
    </motion.div>
  );
};
