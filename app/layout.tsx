import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingNav from "@/components/ui/floating-nav";
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
  title: "Rainey Removal — We Remove Anything",
  description: "Professional removal, packing and moving services. Same-day service available 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FloatingNav />
        {children}
        {/* Premium vanilla JS chatbot — edit at /public/chatbot.js */}
        <Script src="/chatbot.js" strategy="afterInteractive" />
        {/* Premium multi-step quote form — edit at /public/quote-form.js */}
        <Script src="/quote-form.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
