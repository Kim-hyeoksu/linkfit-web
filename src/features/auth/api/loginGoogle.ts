// src/features/auth/api/loginGoogle.ts
import { api } from "@/shared";

export async function loginGoogle() {
  try {
    const response = await api.post("/api/auth/login/google");
    return response.data.callbackUrl;
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error;
  }
}
