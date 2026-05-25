"use client";

type EventParams = Record<string, string | number | boolean | null | undefined>;

type GtagFunction = (
  command: "event",
  eventName: string,
  params?: EventParams
) => void;

// 统一封装 GA4 事件发送，避免组件里重复做 window 和 gtag 判空。
export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === "undefined") {
    return;
  }

  const gtag = (window as Window & { gtag?: GtagFunction }).gtag;

  if (!gtag) {
    return;
  }

  gtag("event", eventName, params);
}
