// src/entities/auth/api/oauthHandlers.ts
import { http, HttpResponse } from "msw";

// 1) OAuth 서버가 유저 승인 후 redirect 해주는 역할
export const oauthHandlers = [
  http.get("/oauth/authorize", () => {
    // 일반적으로 /oauth/authorize?client_id=~ 로 호출된다고 가정
    const redirectUri = "http://localhost:3000/oauth/callback";

    // 유저가 "로그인 승인"했다는 가정
    const fakeCode = "TEST_AUTH_CODE_123";

    return HttpResponse.redirect(`${redirectUri}?code=${fakeCode}`);
  }),

  // 2) code -> accessToken 요청
  http.post("/oauth/token", async ({ request }) => {
    const body = await request.json();

    if (body.code === "TEST_AUTH_CODE_123") {
      return HttpResponse.json({
        accessToken: "FAKE_OAUTH_ACCESS_TOKEN_999",
        refreshToken: "FAKE_OAUTH_REFRESH_TOKEN_999",
        tokenType: "Bearer",
        expiresIn: 3600,
      });
    }

    return HttpResponse.json({ error: "invalid_grant" }, { status: 400 });
  }),
];
