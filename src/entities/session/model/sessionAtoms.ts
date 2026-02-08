import { atomWithStorage } from "jotai/utils";

export interface SessionState {
  sessionId: number | null;
  isSessionStarted: boolean;
  startedAt: string | null; // ISO string
  planId: number | null;
  totalExerciseMs: number; // for initial sync if needed, but better to calculate from startedAt
}

export const sessionStateAtom = atomWithStorage<SessionState>("sessionState", {
  sessionId: null,
  isSessionStarted: false,
  startedAt: null,
  planId: null,
  totalExerciseMs: 0,
});

export const sessionReturnUrlAtom = atomWithStorage<string | null>(
  "sessionReturnUrl",
  null,
);
