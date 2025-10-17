"use client";

import Link from "next/link";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import FloatingWe from "../components/FloatingWe";
export interface NewsItem {
  id: number;
  excerpt: string;
  link: string;
}

// دالة لتحويل أي URL نصي إلى رابط HTML
// دالة لتحويل أي URL نصي إلى رابط HTML يظهر في سطر منفصل
const linkify = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) =>
      `<div class="mt-2"><a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#006f3c] font-medium hover:underline block">انقر هنا</a></div>`
  );
};


export default function NewsPage({news}: {news: NewsItem[]}) {
  const [sanitizedExcerpts, setSanitizedExcerpts] = useState<string[]>([]);

  useEffect(() => {
    // استيراد DOMPurify فقط على العميل
    import("dompurify").then((DOMPurifyModule) => {
      const DOMPurify = DOMPurifyModule.default;
      const sanitized = news.map((item) =>
        DOMPurify.sanitize(linkify(item.excerpt), { USE_PROFILES: { html: true } })
      );
      setSanitizedExcerpts(sanitized);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="relative w-full py-6 bg-gradient-to-r from-[#002c16] via-[#006f3c] to-[#00ff9f] flex flex-col items-center justify-center text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">الأخبار</h1>
        <p className="text-sm opacity-90">لأن التعليم يستحق المتابعة؛ نرصد الحدث.. نصنع الوعي!</p>
      </header>

      <main className="max-w-4xl mx-auto px-2 py-8 grid gap-6">
        {news.map((item, idx) => (
            <article
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-shadow duration-300"
            >
            {sanitizedExcerpts.length > 0 ? (
                <p
                className="text-gray-600 mb-4 text-sm break-words overflow-hidden"
                dangerouslySetInnerHTML={{ __html: sanitizedExcerpts[idx] }}
                />
            ) : (
                <p className="text-gray-600 mb-4 text-sm break-words overflow-hidden">
                {item.excerpt}
                </p>
            )}

            <div className="flex justify-between items-center text-sm text-gray-500">
                <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#006f3c] font-medium hover:underline"
                >
                <span>تعرف على المزيد</span>
                <FiArrowLeftCircle className="w-5 h-5" />
                </Link>
            </div>
            </article>
            
        ))}
        <FloatingWe/>
      </main>
    </div>
  );
}
