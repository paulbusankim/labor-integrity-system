import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { CSPostHogProvider } from "./providers";
import PostHogPageView from "@/components/PostHogPageView";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "알바비 계산기",
  description:
    "교육만 받고 관두셨거나, 일하다 중간에 그만두셨나요? 근로기준법 제36조에 따른 단기·중도 퇴사자 임금 정산 팩트체크. 1분을 일해도 보장받아야 할 내 알바비 정산 기준을 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18370642938"
        strategy="afterInteractive"
      />
      <Script id="google-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-18370642938');
        `}
      </Script>
      <CSPostHogProvider>
        <body className="min-h-full flex flex-col">
          <Suspense fallback="{null}">
            <PostHogPageView />
          </Suspense>
          {children}
          <Analytics />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
