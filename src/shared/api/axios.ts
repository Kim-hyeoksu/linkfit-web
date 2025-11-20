"use client";
import axios from "axios";
import { accessTokenState } from "@/features/auth";
import { useRecoilValue } from "recoil";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // 쿠키 포함 설정
});

// api.interceptors.request.use((config) => {
//   const accessToken = useRecoilValue(accessTokenState); // Recoil에서 accessToken 가져오기
//   if (accessToken) {
//     config.headers["Authorization"] = `Bearer ${accessToken}`;
//   }
//   return config;
// });
