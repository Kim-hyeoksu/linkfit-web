"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { userState } from "@/entities/user/model/userState";
import { getUserMe } from "@/entities/user/api/getUserMe";

export const AuthInitializer = () => {
  const setUser = useSetAtom(userState);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") return;

      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) return;

      try {
        const user = await getUserMe();
        if (user) {
          console.log("Auth initialized:", user);
          setUser(user);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      }
    };

    initializeAuth();
  }, [setUser]);

  return null;
};
