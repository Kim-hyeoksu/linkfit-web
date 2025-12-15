import { api } from "@/shared/api";

export const getOauthToken = async (code: string) => {
  try {
    const response = await api.post("/api/oauth/token", {
      code,
    });

    return response.data;
  } catch (error) {
    console.error("Error requesting access token:", error);
    throw error;
  }
};
