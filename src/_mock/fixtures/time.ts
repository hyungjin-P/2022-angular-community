const MINUTE = 60 * 1000;

/** 일반 시각: 지금으로부터 minutes 분 전 (ISO) */
export function ago(minutes: number): string {
  return new Date(Date.now() - minutes * MINUTE).toISOString();
}

/**
 * 피드 게시 시각. HEAD d5d5205 의 core/utils/date.utils.ts:12-14 가 표시용 경과시간 계산 때
 * 게시 시각에 +2개월을 더하므로, 화면에 "minutes 분 전"으로 보이도록 2개월을 미리 뺀다.
 */
export function feedAgo(minutes: number): string {
  const date = new Date(Date.now() - minutes * MINUTE);
  date.setMonth(date.getMonth() - 2);
  return date.toISOString();
}

export const HOUR = 60;
export const DAY = 24 * HOUR;
