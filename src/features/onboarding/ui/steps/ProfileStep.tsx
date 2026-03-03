import { useRef } from "react";
import { Camera } from "lucide-react";
import { OnboardingData } from "../../model/types";
import { StepLayout } from "./StepLayout";
import { AnimatedLottie } from "../AnimatedLottie";

interface Props {
  data: OnboardingData;
  updateData: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export const ProfileStep = ({ data, updateData, onNext }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isComplete =
    data.name.trim().length > 0 && data.gender !== "" && data.birth_date !== "";

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 실제 프로젝트에서는 여기서 파일을 서버에 업로드하고 URL을 받거나,
      // base64로 변환하여 임시 저장할 수 있습니다.
      // 현재는 로컬 미리보기 URL을 생성하여 저장하는 방식을 시뮬레이션합니다.
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <StepLayout>
      <div className="flex flex-col gap-6 mt-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">기본 정보를</h2>
          <h2 className="text-2xl font-bold text-slate-800">알려주세요</h2>
        </div>

        <div className="flex justify-center -mx-5 -my-4">
          <AnimatedLottie
            url="https://lottie.host/d860a8d7-3cc3-4f31-a6bc-a8193a2eceb0/OQJJYUs9Iy.json"
            className="w-full h-auto"
          />
        </div>

        <div className="flex flex-col gap-8 mt-4">
          {/* 프로필 이미지 업로드 섹션 */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-600">
              프로필 사진
            </label>
            <div className="flex items-center gap-4">
              <div
                className="relative w-16 h-16 cursor-pointer group flex-shrink-0"
                onClick={handleImageClick}
              >
                <div className="w-full h-full rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center transition-all group-hover:border-main">
                  {data.profileImage ? (
                    <img
                      src={data.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Camera size={24} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-main text-white p-1 rounded-full shadow-lg border-2 border-white">
                  <Camera size={10} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="text-sm font-bold text-main text-left"
                >
                  사진 선택하기
                </button>
                <p className="text-xs text-slate-400">
                  멋진 프로필 사진을 등록해 보세요
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-600">
              이름(닉네임)
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[16px] text-slate-800 focus:outline-none focus:border-main focus:bg-white transition-all"
              placeholder="홍길동"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-600">성별</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateData({ gender: "MALE" })}
                className={`p-4 rounded-xl border text-[16px] font-bold transition-all ${
                  data.gender === "MALE"
                    ? "border-main bg-blue-50 text-main"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                남성
              </button>
              <button
                onClick={() => updateData({ gender: "FEMALE" })}
                className={`p-4 rounded-xl border text-[16px] font-bold transition-all ${
                  data.gender === "FEMALE"
                    ? "border-main bg-blue-50 text-main"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                여성
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-600">생년월일</label>
            <input
              type="date"
              value={data.birth_date}
              onChange={(e) => updateData({ birth_date: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[16px] text-slate-800 focus:outline-none focus:border-main focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-10">
        <button
          onClick={onNext}
          disabled={!isComplete}
          className={`w-full py-4 rounded-xl font-bold text-[17px] transition-all ${
            isComplete
              ? "bg-main text-white active:scale-[0.98]"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          다음으로
        </button>
      </div>
    </StepLayout>
  );
};
