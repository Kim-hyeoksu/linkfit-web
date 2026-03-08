"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { userState } from "@/entities/user/model/userState";
import { getUserMe } from "@/entities/user/api/getUserMe";

export const AuthInitializer = () => {
  const setUser = useSetAtom(userState);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = ["/login", "/join"]; // 인증이 필요 없는 경로
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    const initializeAuth = async () => {
      if (typeof window === "undefined") return;

      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        if (!isPublicPath) {
          router.replace("/login");
        }
        return;
      }

      try {
        const user = await getUserMe();
        if (user) {
          console.log("Auth initialized:", user);
          setUser(user);
          // 로그인한 상태인데 로그인 페이지라면 홈으로 이동 (옵션)
          if (isPublicPath) {
            router.replace("/");
          }
        } else {
          // 토큰은 있는데 유저 정보 조회가 안 된 경우 (비정상 상태)
          if (!isPublicPath) {
            router.replace("/login");
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        if (!isPublicPath) {
          router.replace("/login");
        }
      }
    };

    initializeAuth();
  }, [setUser, router, pathname]);

  return null;
};
