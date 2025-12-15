"use client";
import { Header } from "@/shared";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
export default function SignupInfoPage() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // 현재 코드상 email이지만, 휴대폰 번호로 변경 가능
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    // 이름과 이메일(또는 휴대폰 번호)이 모두 비어있지 않으면 폼이 유효하다고 판단
    if (name.trim() !== "" && phoneNumber.trim() !== "") {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, phoneNumber]); // name 또는 email 상태가 변경될 때마다 이펙트 실행

  const handleNext = () => {
    if (isFormValid) {
      // 폼이 유효할 때만 다음 단계로 이동
      router.push("/signup/info/step2"); // 다음 단계 경로로 이동
    } else {
      // 유효하지 않으면 사용자에게 피드백 제공 (예: 입력 필드 강조, 경고 메시지 등)
      alert("이름과 이메일을 모두 입력해주세요.");
    }
  };
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 입력된 값에서 숫자가 아닌 모든 문자(공백 포함)를 제거합니다.
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(numericValue);
  };

  return (
    <div>
      <Header />
      <main className="px-[20px] pt-[92px]">
        <h1 className="mb-4">본인 확인을 위해 정보를 입력해 주세요.</h1>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label>이름</label>
            <input
              className="border border-[#d9d9d9] rounded-[8px] h-[45px] px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>휴대폰 번호</label>
            <input
              className="border border-[#d9d9d9] rounded-[8px] h-[45px] px-3 
              focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent
              "
              type="tel" // type="tel"로 변경하여 모바일에서 숫자 키패드가 뜨도록 유도
              inputMode="numeric" // 모바일에서 숫자 키패드를 더 확실하게 유도
              pattern="[0-9]*" // 숫자만 입력되도록 HTML5 패턴 적용 (추가적인 브라우저 지원)
              id="phoneNumber" // id 변경
              name="phoneNumber" // name 변경
              required
              value={phoneNumber} // 상태 연결
              onChange={handlePhoneNumberChange} // 숫자만 허용하는 변경 핸들러 연결
            />
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
