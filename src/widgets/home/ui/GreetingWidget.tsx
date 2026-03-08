import React from "react";

export const GreetingWidget = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-[22px] font-extrabold text-gray-900 leading-tight">
          안녕하세요 닉네임님! 👋
        </h1>
        <p className="text-[14px] font-medium text-slate-500 mt-1">
          오늘도 힘차게 득근해 볼까요?
        </p>
      </div>
      <div className="w-[52px] h-[52px] rounded-[18px] bg-slate-200 overflow-hidden shadow-sm border border-slate-100 flex items-center justify-center">
        {/* 프로필 이미지 Placeholder */}
        <span className="text-xl font-bold text-slate-400">👤</span>
      </div>
    </div>
  );
};
