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

// 응답 인터셉터: 에러를 표준화해 status/body를 포함
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const body = error?.response?.data;
    const err: any = new Error(`API Error: ${status ?? "unknown"}`);
    err.status = status;
    err.body = body;
    return Promise.reject(err);
  }
);
