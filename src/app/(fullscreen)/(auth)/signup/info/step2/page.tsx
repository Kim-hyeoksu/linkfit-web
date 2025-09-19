"use client";
import Header from "@/components/common/Header";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
export default function SignupInfoPage() {
  const [type, setType] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const router = useRouter();

  const handleNext = () => {
    // 여기에 다음 단계로 넘어가는 로직을 추가하세요.
    // 예를 들어, 입력된 정보를 검증하고 다음 페이지로 이동할 수 있습니다.
    router.push("/signup/info/step3");
  };
  useEffect(() => {
    // 이름과 이메일(또는 휴대폰 번호)이 모두 비어있지 않으면 폼이 유효하다고 판단
    if (type.trim() !== "") {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [type]); // name 또는 email 상태가 변경될 때마다 이펙트 실행
  return (
    <div>
      <Header />
      <main className="px-[20px] pt-[92px]">
        <h1>회원 유형을 선택해 주세요.</h1>
        <div className="grid grid-cols-2 gap-5">
          <div
            onClick={() => setType("트레이너")}
            className={`border border-[#d9d9d9] h-[240px] rounded-[8px] ${
              type === "트레이너" // gender가 "남성"일 때 활성 스타일 적용
                ? "border-blue-500 text-blue-500 font-semibold" // 활성 상태 스타일
                : "border-[#d9d9d9] text-gray-700" // 비활성 상태 스타일 (기본)
            }`}
          >
            <div></div>
            <div>
              <h1>트레이너</h1>
              <p>회원을 관리하고 계획을 세울 수 있어요.</p>
            </div>
          </div>
          <div
            onClick={() => setType("트레이니")}
            className={`border border-[#d9d9d9] h-[240px] rounded-[8px] ${
              type === "트레이니" // gender가 "남성"일 때 활성 스타일 적용
                ? "border-blue-500 text-blue-500 font-semibold" // 활성 상태 스타일
                : "border-[#d9d9d9] text-gray-700" // 비활성 상태 스타일 (기본)
            }`}
          >
            <div></div>
            <div>
              <h1>트레이니</h1>
              <p>나의 운동과 식단을 기록할래요.</p>
            </div>
          </div>
        </div>
        <div
          onClick={handleNext}
          className="
          fixed bottom-0 left-0 right-0 // 화면 하단에 고정
          bg-white // 키보드 위에서 배경색이 가려지지 않도록
          p-4 // 내부 패딩
        "
        >
          <button
            onClick={handleNext} // 버튼 클릭 시 handleNext 함수 호출
            disabled={!isFormValid} // 폼이 유효하지 않으면 버튼 비활성화
            className={`
            w-full py-3 rounded-[8px] font-semibold text-center
            transition-colors duration-200 ease-in-out // 부드러운 전환 효과

            ${
              isFormValid
                ? "bg-blue-500 text-white cursor-pointer" // 유효할 때 (활성 상태)
                : "bg-gray-100 text-gray-400 cursor-not-allowed" // 유효하지 않을 때 (비활성 상태)
            }
          `}
            type="button"
          >
            다음
          </button>
        </div>
      </main>
    </div>
  );
}
