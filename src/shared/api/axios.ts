import axios from "axios";
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 쿠키 포함 설정
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken"); // Recoil에서 액세스 토큰을 가져옵니다.
  console.log("Attaching token to request:", token);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
