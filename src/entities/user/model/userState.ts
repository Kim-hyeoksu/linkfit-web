import { atom } from "jotai";
import { User } from "./types";

// 사용자 정보를 담을 Atom
export const userState = atom<User | null>(null);
