"use client";

import Link from "next/link";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import FloatingWe from "../components/FloatingWe";
interface NewsItem {
  id: number;
  excerpt: string;
  link: string;
}

const news: NewsItem[] = [
  {
    id: 1,
    excerpt:
      "عاجل || إعلان الحدود الدنيا وشروط التقدم المطلوبة لمفاضلة القبول الموازي فقط في الجامعات الحكومية في سوريا والمعاهد التقانية التابعة للمجلس الأعلى للتعليم التقاني، لحملة الشهادات الثانوية العامة من عام 2011 ولغاية عام 2024.🔗للاطلاع على الملف من خلال تلغرام https://t.me/ecl_co/2408🔗للاطلاع على الملف من خلال درايفhttps://drive.google.com/file/d/1zKBy9cMEZee6oWX8nRyHwnfLW4K2MTby/view?usp=drivesdk #منصة_ECL_التعليمية https://heylink.me/Ecl_team/",
    link: "https://whatsapp.com/channel/0029VaDNR4VIiRou3CyWzC0M",
  },
  {
    id: 2,
    excerpt:
      "عاجل || ستبدأ الدورة التكميلية للخريجين بتاريخ 10/12 ويحق لمن لديه حمل 8 مواد على الأكثر التقدم إليها.#منصة_ECL_التعليمية https://heylink.me/Ecl_team/",
    link: "https://whatsapp.com/channel/0029VaDNR4VIiRou3CyWzC0M",
  },
  {
    id: 3,
    excerpt:
      "رئيس لجنة التحول الرقمي في وزارة التعليم العالي والبحث العلمي الدكتور محمد السويد :تنوه وزارة التعليم العالي والبحث العلمي إلى طلابها الأعزاء بأن التسجيل على مفاضلة الشهادات القديمة سيكون متاحاً عبر نفس الرابط الخاص بالمفاضلة العامة للقبول الجامعي.وعليه، فإن جميع الطلاب الذين تنطبق عليهم شروط التسجيل على مفاضلة الشهادات القديمة يمكنهم الدخول إلى الرابط ذاته وإتمام عملية التسجيل بكل سهولة.تتمنى الوزارة التوفيق والنجاح لجميع طلابها.#منصة_ECL_التعليمية https://heylink.me/Ecl_team/",
    link: "https://whatsapp.com/channel/0029VaDNR4VIiRou3CyWzC0M",
  },
];

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


export default function NewsPage() {
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
        <p className="text-sm opacity-90">آخر مستجدات التعليم في الجمهورية العربية السورية</p>
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
