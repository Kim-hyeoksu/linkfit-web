import { useSetAtom } from "jotai";
import { accessTokenState } from "./";

// 컴포넌트 내에서 호출할 함수로 수정
export function useUpdateAccessToken() {
  const setAccessToken = useSetAtom(accessTokenState);
  return (newToken: string | null) => {
    setAccessToken(newToken);
  };
}
