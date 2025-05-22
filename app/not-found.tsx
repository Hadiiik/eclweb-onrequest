import Link from "next/link";
import { FaSadTear } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4" dir="rtl">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <FaSadTear size={60} className="text-green-500" />
        </div>
        <h1 className="text-5xl font-bold text-green-700 mb-4">404</h1>
        <p className="text-xl text-green-600 mb-6">عذرًا، الصفحة التي تبحث عنها غير موجودة.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
