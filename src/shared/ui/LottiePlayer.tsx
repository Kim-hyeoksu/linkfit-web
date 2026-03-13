"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottiePlayerProps {
  url: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * @name LottiePlayer
 * @description .lottie 및 JSON 파일을 지원하는 업그레이드된 애니메이션 플레이어입니다.
 * dotLottie 라이브러리를 사용하여 로딩이 빠르고 효율적입니다.
 */
export const LottiePlayer = ({
  url,
  loop = true,
  autoplay = true,
  className,
  style,
}: LottiePlayerProps) => {
  return (
    <div className={className} style={style}>
      <DotLottieReact
        src={url}
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
};
