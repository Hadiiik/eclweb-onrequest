import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiAlertCircle } from "react-icons/fi";
import ToastNotification from "./ToastNotification"; // استدعاء مكون التوست

interface ReportProblemProps {
  id: string | undefined;
}

const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [container] = useState(() => {
    if (typeof document !== "undefined") {
      const el = document.createElement("div");
      el.setAttribute("data-portal", "report-problem");
      return el;
    }
    return null as unknown as HTMLDivElement;
  });

  useEffect(() => {
    if (!container) return;
    document.body.appendChild(container);
    setMounted(true);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  if (!mounted || !container) return null;
  return createPortal(children, container);
};

const ReportProblem: React.FC<ReportProblemProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ حالة لتوست الإشعارات
  const [toast, setToast] = useState<{
    message: string;
    isError?: boolean;
  } | null>(null);

  // منع تمرير الخلفية عند فتح المودال
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

const sendReport = async () => {
  setLoading(true);

  try {
    const res = await fetch("/api/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `بلاغ عن ملف:\n\n https://ecl-onrequest.vercel.app/share_file?id=${id}\n\n نص الابلاغ : ${message}\n\n رقم الابلاغ : ${id}`,
      }),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      setToast({
        message: data?.error || "حدث خطأ أثناء الإرسال ❌",
        isError: true,
      });
    } else {
      setToast({ message: "تم إرسال البلاغ بنجاح ✅", isError: false });
      setMessage(""); // إعادة تعيين النص
    }
  } catch {
    setToast({
      message: "تعذر الاتصال بالخادم، حاول لاحقًا ❌",
      isError: true,
    });
  } finally {
    setLoading(false);
    setIsOpen(false); // ✅ إغلاق المودال بعد الإرسال سواء نجاح أو فشل
  }
};



  return (
    <>
      {/* زر البلاغ مع أيقونة */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-10 h-10 text-red-600 rounded-2xl hover:bg-[#b71c1c] hover:text-white transition"
        aria-label="أبلغ عن مشكلة"
        type="button"
      >
        <FiAlertCircle size={30} />
      </button>

      {/* المودال عبر البورتال إلى body */}
      {isOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-white/40 backdrop-blur-sm" dir="rtl">
            {/* الخلفية تغطي الشاشة كاملة */}
            <button
              type="button"
              aria-label="إغلاق"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40"
            />
            {/* توسيط المحتوى في منتصف الشاشة */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-semibold mb-3 text-center text-red-600">
                  إرسال بلاغ
                </h2>

                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  rows={5}
                  placeholder="اكتب نص الإبلاغ :إذا واجهت خطأً أو مشكله في الملف أو اسمه أو وصفه  أو كانت الفلاتر غير متناسقة مع محتوى الملف يمكنك اخبارنا بذلك من هنا"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition text-sm"
                    type="button"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={sendReport}
                    disabled={!message.trim() || loading}
                    className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm disabled:opacity-50 transition"
                    type="button"
                  >
                    {loading ? "جارٍ الإرسال..." : "إرسال البلاغ"}
                  </button>

                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ✅ مكون التوست يظهر عند الحاجة */}
      {toast && (
        <ToastNotification
          message={toast.message}
          isError={toast.isError}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ReportProblem;
