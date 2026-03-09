"use client";
import Image from "next/image";
export default function SettingsProfilePage() {
  return (
    <div className="py-5">
      {/* 프로필 이미지 */}
      <div className="flex items-center justify-center">
        <div className="w-25 flex flex-col justify-center gap-5">
          <div className="w-25 h-25 relative rounded-[50%] bg-[#D9D9D9]">
            <div className="absolute w-[28px] h-[28px] bottom-0 right-0 bg-[#0EA5E9] rounded-[4px]"></div>
          </div>
          <div className="flex text-center gap-2">
            <div>이미지</div>강동원님
          </div>
        </div>
      </div>
      {/* 내 정보 */}
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-4">내 정보</h1>
        <ul className="space-y-2">
          <li>
            <div className="flex justify-between items-center h-[50px] pr-7 border-b border-[#F3F4F6]">
              <div>회원 유형</div>
              <div>트레이너</div>
            </div>
          </li>
          <li>
            <div className="flex justify-between items-center h-[50px] border-b border-[#F3F4F6]">
              <div>휴대폰 번호</div>
              <div className="flex items-center">
                트레이너
                <Image
                  src="/images/common/arrow_forward_ios_24px.svg"
                  width={12}
                  height={16}
                  alt="인증 아이콘"
                  className="ml-4"
                />
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-between items-center h-[50px] border-b border-[#F3F4F6]">
              <div>신체 정보</div>
              <div className="flex items-center">
                트레이너
                <Image
                  src="/images/common/arrow_forward_ios_24px.svg"
                  width={12}
                  height={16}
                  alt="인증 아이콘"
                  className="ml-4"
                />
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-between items-center h-[50px] border-b border-[#F3F4F6]">
              <div>운동 수준</div>
              <div className="flex items-center">
                트레이너
                <Image
                  src="/images/common/arrow_forward_ios_24px.svg"
                  width={12}
                  height={16}
                  alt="인증 아이콘"
                  className="ml-4"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
      {/* 설정 */}
      <div>
        <h1 className="text-2xl font-bold mb-4">설정</h1>
        <ul className="space-y-2">
          <li>
            <div className="flex justify-between items-center h-[50px] border-b border-[#F3F4F6]">
              <div>알림 설정</div>
              <div className="flex items-center">
                트레이너
                <Image
                  src="/images/common/arrow_forward_ios_24px.svg"
                  width={12}
                  height={16}
                  alt="인증 아이콘"
                  className="ml-4"
                />
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-between items-center h-[50px] border-b border-[#F3F4F6]">
              <div>문의하기</div>
              <div className="flex items-center">
                트레이너
                <Image
                  src="/images/common/arrow_forward_ios_24px.svg"
                  width={12}
                  height={16}
                  alt="인증 아이콘"
                  className="ml-4"
                />
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-between items-center h-[50px] pr-7 border-b border-[#F3F4F6]">
              <div>개인정보처리방침</div>
            </div>
          </li>
          <li>
            <div className="flex justify-between items-center h-[50px] pr-7 border-b border-[#F3F4F6]">
              <div>이용약관</div>
            </div>
          </li>
        </ul>
      </div>
      {/* 계정 관리 */}
      <div>
        <h1 className="text-2xl font-bold mb-4">내 정보</h1>
        <ul className="space-y-2">
          <li>
            <div className="flex justify-between items-center h-[50px] border-b border-[#F3F4F6]">
              <div>로그아웃</div>
              <div className="flex items-center">
                <Image
                  src="/images/common/arrow_forward_ios_24px.svg"
                  width={12}
                  height={16}
                  alt="인증 아이콘"
                  className="ml-4"
                />
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-between items-center h-[50px] border-b border-[#F3F4F6]">
              <div>탈퇴하기</div>
              <div className="flex items-center">
                <Image
                  src="/images/common/arrow_forward_ios_24px.svg"
                  width={12}
                  height={16}
                  alt="인증 아이콘"
                  className="ml-4"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
