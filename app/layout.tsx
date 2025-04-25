import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Kufi_Arabic } from "next/font/google";
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
  title: "ُECL",
  description: "نحو التطور و الإبداع",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <link rel="icon"  href="/ecl_logo.png"></link>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${NotoKufiArabic.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
