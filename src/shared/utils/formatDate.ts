/**
 * 날짜 객체를 현지 시간 기준의 'YYYY-MM-DD' 형식 문자열로 변환합니다.
 * toISOString()의 시차 문제를 해결합니다.
 */
export const formatDateToLocalISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
