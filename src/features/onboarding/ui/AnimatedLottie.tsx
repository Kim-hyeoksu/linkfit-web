"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface AnimatedLottieProps {
  url: string;
  className?: string;
}

export const AnimatedLottie = ({ url, className }: AnimatedLottieProps) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie load failed:", err));
  }, [url]);

  if (!animationData) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-main animate-spin" />
      </div>
    );
  }

  return (
    <div className={className}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};
