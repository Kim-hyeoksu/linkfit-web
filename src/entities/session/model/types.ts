export interface StartSessionRequest {
  planId: number;
  userId: number;
  sessionDate?: string; // YYYY-MM-DD
  memo?: string;
}
