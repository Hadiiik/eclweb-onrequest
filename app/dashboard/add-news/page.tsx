"use client";

import { useState } from "react";
import { FiSend, FiArrowLeftCircle ,FiLoader} from "react-icons/fi";
import Link from "next/link";

export default function NewsInputPage() {
  const [excerpt, setExcerpt] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading,setIsloading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsloading(true);
    e.preventDefault();

    if (!excerpt.trim()) {
      setMessage("⚠️ يرجى إدخال نص الخبر قبل الإرسال.");
      return;
    }

    // يمكنك لاحقاً هنا إرسال البيانات إلى قاعدة البيانات أو API
     await fetch("/api/nesw/add-news", { method: "POST", body: JSON.stringify({ excerpt: excerpt, link: link.trim() || null }) })

    setMessage("✅ تم إضافة الخبر بنجاح!");
    setExcerpt("");
    setLink("");
    setIsloading(false)
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="relative w-full py-6 bg-gradient-to-r from-[#002c16] via-[#006f3c] to-[#00ff9f] flex flex-col items-center justify-center text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">إضافة خبر جديد</h1>
        <p className="text-sm opacity-90">شارك آخر المستجدات التعليمية مع المتابعين</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4"
        >
          <label className="text-[#002c16] font-medium">
            نص الخبر:
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="اكتب نص الخبر هنا..."
              className="mt-2 w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#006f3c] resize-none h-40"
            />
          </label>

          <label className="text-[#002c16] font-medium">
            رابط لمزيد من المعلومات :
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="mt-2 w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#006f3c]"
            />
          </label>

          {message && (
            <div
              className={`text-center text-sm font-medium ${
                message.startsWith("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 bg-gradient-to-r from-[#002c16] via-[#006f3c] to-[#00ff9f] text-white font-semibold rounded-xl py-3 flex justify-center items-center gap-2 transition ${
              isLoading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {isLoading ? (
              <>
                جاري الإرسال...
                <FiLoader className="w-5 h-5 animate-spin" />
              </>
            ) : (
              <>
                إضافة الخبر
                <FiSend className="w-5 h-5" />
              </>
            )}
          </button>

          <Link
            href="/news"
            className="mt-4 text-[#006f3c] font-medium flex justify-center items-center gap-1 hover:underline text-sm"
          >
            
            اذهب لصفحة الأخبار
            <FiArrowLeftCircle className="w-4 h-4" />
          </Link>
        </form>
      </main>
    </div>
  );
}
