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
      const { type, uri } = JSON.parse(event.data);

      if (type === "image-selected") {
        console.log("uri", uri);
        setImageUri(uri);
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
