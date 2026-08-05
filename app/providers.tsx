"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

// 브라우저 환경이고 환경변수가 존재할 때 최상단에서 즉시 초기화
if (typeof window !== "undefined") {
  if (
    process.env.NEXT_PUBLIC_POSTHOG_KEY &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST
  ) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only", // 익명 유저 프로필 생성 방지
      capture_pageview: false, // 수동 트래킹 사용
    });
  }
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}