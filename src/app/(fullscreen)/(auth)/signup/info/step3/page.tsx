"use client";
import { Header } from "@/shared";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
export default function SignupInfoPage() {
  const router = useRouter();

  const [gender, setGender] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [exerciseLevel, setExerciseLevel] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const handleNext = () => {
    // 여기에 다음 단계로 넘어가는 로직을 추가하세요.
    // 예를 들어, 입력된 정보를 검증하고 다음 페이지로 이동할 수 있습니다.
    router.push("/");
  };
  useEffect(() => {
    // 이름과 이메일(또는 휴대폰 번호)이 모두 비어있지 않으면 폼이 유효하다고 판단
    if (
      gender.trim() !== "" &&
      birthDate.trim() !== "" &&
      height.trim() !== "" &&
      weight.trim() !== "" &&
      exerciseLevel.trim() !== ""
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [gender, birthDate, height, weight, exerciseLevel]); // name 또는 email 상태가 변경될 때마다 이펙트 실행
  return (
    <div>
      <Header />
      <main className="px-[20px] pt-[92px]">
        <h1 className="mb-4">
          LinkFit 서비스 이용을 위해 기본 정보를 <br />
          입력해 주세요.
        </h1>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">성별</label>
            <div className="grid grid-cols-2 gap-5">
              <button
                onClick={() => setGender("남성")}
                className={`
              border rounded-[8px] h-[44px]
              flex items-center justify-center // 텍스트 중앙 정렬
              transition-all duration-200 ease-in-out // 부드러운 전환 효과

              ${
                gender === "남성" // gender가 "남성"일 때 활성 스타일 적용
                  ? "border-blue-500 text-blue-500 font-semibold" // 활성 상태 스타일
                  : "border-[#d9d9d9] text-gray-700" // 비활성 상태 스타일 (기본)
              }
            `}
              >
                남성
              </button>
              <button
                onClick={() => setGender("여성")}
                className={`
              border rounded-[8px] h-[44px]
              flex items-center justify-center
              transition-all duration-200 ease-in-out

              ${
                gender === "여성" // gender가 "여성"일 때 활성 스타일 적용
                  ? "border-blue-500 text-blue-500 font-semibold" // 활성 상태 스타일
                  : "border-[#d9d9d9] text-gray-700" // 비활성 상태 스타일 (기본)
              }
            `}
              >
                여성
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">생년월일</label>
            <input
              onChange={(e) => setBirthDate(e.target.value)}
              className="border border-[#d9d9d9] rounded-[8px] h-[45px] px-[15px]"
              type="Date"
              id="email"
              name="email"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email">키 (cm)</label>
              <input
                onChange={(e) => setHeight(e.target.value)}
                className="border border-[#d9d9d9] rounded-[8px] h-[45px] px-[15px]"
                type="number"
                id="email"
                name="email"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">몸무게 (kg)</label>
              <input
                onChange={(e) => setWeight(e.target.value)}
                className="border border-[#d9d9d9] rounded-[8px] h-[45px] px-[15px]"
                type="number"
                id="email"
                name="email"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="name">운동수준</label>
            <div className="relative">
              {" "}
              {/* 화살표 아이콘 등을 위해 relative 컨테이너 필요 */}
              <select
                className="
                    block w-full // 블록 요소로 전체 너비 차지
                    border border-[#d9d9d9] rounded-[8px] h-[45px] // 기존 input과 유사한 스타일
                    pr-8 // 드롭다운 화살표 공간 확보 (오버랩 방지)
                    appearance-none // 기본 화살표 숨김 (커스텀 화살표를 사용하고 싶을 때)
                    bg-white // 배경색을 명시하여 투명성을 제거
                    leading-tight // 텍스트 줄 간격 조정
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent // 포커스 시 스타일
                    px-2 // 왼쪽 패딩
                  "
                id="exerciseLevel"
                name="exerciseLevel"
                required
                value={exerciseLevel} // 상태와 select 값 연결
                onChange={(e) => setExerciseLevel(e.target.value)} // 값 변경 핸들러
              >
                <option value="" disabled>
                  운동 수준을 선택해 주세요
                </option>{" "}
                {/* 초기placeholder 옵션 */}
                <option value="초보자">초보자</option>
                <option value="중급자">중급자</option>
                <option value="고급자">고급자</option>
              </select>
              {/* 커스텀 드롭다운 화살표 아이콘 (Tailwind UI 예시 스타일) */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
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
