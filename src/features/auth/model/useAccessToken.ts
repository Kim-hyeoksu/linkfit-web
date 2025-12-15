"use client";
import { useRecoilValue } from "recoil";
import { accessTokenState } from "./";

export function useAccessToken() {
  return useRecoilValue(accessTokenState); // 상태를 읽어오는 훅은 컴포넌트 내에서 호출해야 함
}
