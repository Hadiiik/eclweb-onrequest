import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Kufi_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const NotoKufiArabic = Noto_Kufi_Arabic({
  variable:"--font",
  subsets:["arabic"]
})


export const metadata: Metadata = {
  title: "ECL",
  description: "نحو التطور و الإبداع",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
        <link rel="icon" href="/favicon.ico" sizes="any" />
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${NotoKufiArabic.className} antialiased`}
      >
        {/* <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.8)", color: "white", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          الموقع قيد التطوير...
        </div> */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
