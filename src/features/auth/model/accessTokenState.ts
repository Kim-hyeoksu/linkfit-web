"use client";
import { atom } from "jotai";

export const accessTokenState = atom<string | null>(null);
