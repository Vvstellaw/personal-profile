import type { Metadata } from "next";
import { AdminProvider } from "@/providers/AdminProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "个人 Profile",
  description: "AI 探索者的个人主页",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="antialiased">
      <body className="min-h-screen text-apple-text relative bg-[#f5f5f7]">
        {/* Premium mesh gradient background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Warm peach glow - top left */}
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full opacity-70"
            style={{ background: 'radial-gradient(ellipse at center, rgba(255,180,150,0.18) 0%, transparent 60%)' }} />
          {/* Cool blue glow - top right */}
          <div className="absolute -top-[10%] -right-[5%] w-[55%] h-[55%] rounded-full opacity-80"
            style={{ background: 'radial-gradient(ellipse at center, rgba(120,170,255,0.15) 0%, transparent 60%)' }} />
          {/* Violet glow - bottom */}
          <div className="absolute -bottom-[30%] left-[20%] w-[60%] h-[60%] rounded-full opacity-60"
            style={{ background: 'radial-gradient(ellipse at center, rgba(140,100,240,0.12) 0%, transparent 60%)' }} />
          {/* Warm amber accent - middle right */}
          <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full opacity-50"
            style={{ background: 'radial-gradient(ellipse at center, rgba(255,200,120,0.10) 0%, transparent 60%)' }} />
        </div>
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
