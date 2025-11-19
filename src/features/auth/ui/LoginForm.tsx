import Link from "next/link";
import Image from "next/image";

export const LoginForm = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center px-[20px]">
      <div className="flex flex-col gap-5 mb-[270px]">
        <h1 className="text-[24px] text-[#4b5563]">스마트한 PT 관리</h1>
        <h1 className="font-bold text-[32px]">LinkFit</h1>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <Link
          href={"/"}
          className="flex items-center justify-center gap-2 bg-white w-[320px] h-[42px] rounded-[8px] border border-[#e5e5e5]"
        >
          <Image
            src="/images/login/google-icon.svg"
            alt="Google Icon"
            width={34}
            height={34}
          />
          <div className="text-xs">Google로 계속하기</div>
        </Link>
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
