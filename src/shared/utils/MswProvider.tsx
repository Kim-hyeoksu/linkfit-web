"use client";
import { useEffect } from "react";
import { initMsw } from "@/mocks/initMsw";

export const MswProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
      initMsw(); // ✅ 딱 한 번만 실행
      console.log("난 클라이언트");
    }
  }, []);

  return <>{children}</>;
};
