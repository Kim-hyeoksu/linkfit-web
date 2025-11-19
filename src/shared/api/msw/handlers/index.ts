import { programHandlers } from "./programHandler";
import { oauthHandlers } from "@/features/auth";
export const handlers = [...oauthHandlers, ...programHandlers];
