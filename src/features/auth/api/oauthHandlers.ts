import { http, HttpResponse } from "msw";

// 1) OAuth 서버가 유저 승인 후 redirect 해주는 역할
export const oauthHandlers = [
  http.post("/api/auth/login/google", () => {
    const fakeAuthCode = "valid-auth-code-123";
    const callbackUrl = `http://localhost:3000/oauth/callback?code=${fakeAuthCode}`;

    return HttpResponse.json({ callbackUrl });
  }),

  // 2) code -> accessToken 요청
  http.post("/api/oauth/token", async ({ request }) => {
    const body = await request.clone().json();
    if (body.code === "valid-auth-code-123") {
      const accessToken = "FAKE_OAUTH_ACCESS_TOKEN_999";
      const refreshToken = "FAKE_OAUTH_REFRESH_TOKEN_999";

      // 응답 헤더에서 refresh token을 쿠키로 보내고, access token은 body에 넣기
      return HttpResponse.json(
        {
          accessToken, // body로 전달
        },
        {
          headers: {
            // Refresh token을 HttpOnly 쿠키로 전달
            "Set-Cookie": `refreshToken=${refreshToken};`,
          },
        }
      );
    }

    return HttpResponse.json({ error: "invalid_grant" }, { status: 400 });
  }),
];
