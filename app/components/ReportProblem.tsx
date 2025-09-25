import { useState } from "react";
import { FiAlertCircle } from "react-icons/fi"

interface ReportProblemProps {
  id: string | undefined;
}

const ReportProblem: React.FC<ReportProblemProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendReport = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `بلاغ عن ملف:\n\n https://ecl-onrequest.vercel.app/share_file?id=${id}\n\n نص الابلاغ : ${message}\n\n رقم الابلاغ : ${id}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("خطأ من السيرفر:", data);
        throw new Error(data.error || "حدث خطأ أثناء الإرسال");
      }

      setSuccess(true);
      setMessage("");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إرسال البلاغ. تحقق من إعدادات البوت والشات ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* زر البلاغ مع أيقونة */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-10 h-10 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition"
        aria-label="أبلغ عن مشكلة"
      >
        <FiAlertCircle size={30}/> 
      </button>

      {/* المودال */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl transform scale-100 animate-fadeIn m-4">
            <h2 className="text-xl font-semibold mb-3 text-center text-red-600">
              إرسال بلاغ
            </h2>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              rows={5}
              placeholder="اكتب نص الابلاغ ... مثلا : خطـأ في تسمية الملف , جودة الملف سيئة , الخ ..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition text-sm"
              >
                إلغاء
              </button>
              <button
                onClick={sendReport}
                disabled={loading}
                className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm disabled:opacity-50 transition"
              >
                {loading ? "جارٍ الإرسال..." : "إرسال البلاغ"}
              </button>
            </div>

            {success && (
              <p className="text-green-600 mt-3 text-center font-medium">
                تم إرسال البلاغ بنجاح!
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReportProblem;
