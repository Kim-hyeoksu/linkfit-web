"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function DietPage() {
  const [imageUri, setImageUri] = useState("");
  function sendMessageToNative() {
    console.log("Sending message to React Native WebView");
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: "choose-image",
      })
    );
  }
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // 1) RN WebView 환경인지 체크
      const isWebView = !!(window as any).ReactNativeWebView;
      if (!isWebView) return; // ← 웹 환경에서는 무시

      try {
        // 2) 안전한 JSON 파싱
        const data = JSON.parse(event.data);

        if (data.type === "image-selected") {
          setImageUri(data.uri);
        }
      } catch (err) {
        // 웹 환경 / 포맷 무효일 때 에러 방지
        console.warn("Invalid WebView message:", event.data);
      }
    };

    window.addEventListener("message", onMessage);

    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div>
      {imageUri && (
        <Image alt="image" src={imageUri} width={300} height={300} />
      )}
      {imageUri}
      <button onClick={sendMessageToNative}>Sample Button</button>
    </div>
  );
}
