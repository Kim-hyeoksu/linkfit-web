// export const initMsw = async () => {
//   if (typeof window !== "undefined") {
//     const { worker } = await import("./browser");
//     await worker.start();
//   }
// };
export async function initMsw() {
  if (typeof window === "undefined") {
    // ✅ SSR 환경 (Node.js)
    const { server } = await import("./server");
    server.listen({
      onUnhandledRequest: "bypass", // 핸들러 없는 요청은 그냥 통과
    });
  } else {
    // ✅ CSR 환경 (브라우저)
    const { worker } = await import("./browser");
    worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}
