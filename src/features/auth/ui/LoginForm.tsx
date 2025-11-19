"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
export const LoginForm = () => {
  const router = useRouter();
  const handleGoogleLogin = async () => {
    try {
      // 1) MSW 모킹 엔드포인트 호출
      const response = await fetch("/api/auth/login/google", {
        method: "POST",
      });

      if (!response.ok) throw new Error("로그인 실패");

      const { callbackUrl } = await response.json();

      // 2) 가상의 콜백 URL로 내부 라우팅
      router.push(callbackUrl); // 여기서 oauth/callback?code=valid-auth-code-123 로 이동
    } catch (error) {
      console.error("Google 로그인 중 오류 발생:", error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center px-[20px]">
      <div className="flex flex-col gap-5 mb-[270px]">
        <h1 className="text-[24px] text-[#4b5563]">스마트한 PT 관리</h1>
        <h1 className="font-bold text-[32px]">LinkFit</h1>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 bg-white w-[320px] h-[42px] rounded-[8px] border border-[#e5e5e5]"
        >
          <Image
            src="/images/login/google-icon.svg"
            alt="Google Icon"
            width={34}
            height={34}
          />
          <div className="text-xs">Google로 계속하기</div>
        </button>
        <Link
          href={"/"}
          className="flex items-center justify-center gap-2 bg-[#2db400] w-[320px] h-[42px] rounded-[8px] border border-[#e5e5e5]"
        >
          <Image
            src="/images/login/naver-icon.svg"
            alt="Naver Icon"
            width={34}
            height={34}
          />
          <div className="text-xs">네이버로 계속하기</div>
        </Link>
        <Link
          href={"/"}
          className="flex items-center justify-center gap-2 bg-[#fee500] w-[320px] h-[42px] rounded-[8px] border border-[#e5e5e5]"
        >
          <Image
            src="/images/login/kakao-icon.svg"
            alt="Kakao Icon"
            width={34}
            height={34}
          />
          <span className="text-xs">카카오로 계속하기</span>
        </Link>
      </div>
    </div>
  );
};
