import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "chi - AI 对话管理器",
  description: "记录、整理、回顾你的 AI 对话",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
