import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { I18nProvider } from "@/lib/i18n/context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://my-duty-connector.vercel.app";

export const metadata: Metadata = {
  title: "MyDuty Connector",
  description:
    "마이듀티 공유 링크를 캘린더 일정으로 변환하세요. 앱 설치 없이 근무표를 내 캘린더에 등록할 수 있습니다.",
  keywords: [
    "마이듀티",
    "MyDuty",
    "간호사",
    "근무표",
    "듀티",
    "캘린더",
    "ICS",
    "교대근무",
    "일정 변환",
  ],
  authors: [{ name: "hexdrinker", url: "https://github.com/hexdrinker" }],
  creator: "hexdrinker",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.svg",
  },
  verification: {
    google: "ePNFEAzqkP50hTWK8ZMdq3eyFLVdKokWn0JaLVpk4fs",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: siteUrl,
    title: "MyDuty Connector",
    description:
      "마이듀티 공유 링크를 캘린더 일정으로 변환하세요. 앱 설치 없이 근무표를 내 캘린더에 등록할 수 있습니다.",
    siteName: "MyDuty Connector",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "MyDuty Connector",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyDuty Connector",
    description:
      "마이듀티 공유 링크를 캘린더 일정으로 변환하세요. 앱 설치 없이 근무표를 내 캘린더에 등록할 수 있습니다.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
