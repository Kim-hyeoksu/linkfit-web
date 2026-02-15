import axios from "axios";
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 쿠키 포함 설정
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("accessToken");
    // console.log("Attaching token to request:", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// 응답 인터셉터: 별도의 가공 없이 에러를 던지도록 하여 Axios 고유의 에러 처리를 따름
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
