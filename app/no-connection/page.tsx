'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const router = useRouter();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* أيقونة */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          </div>
        </div>

        {/* النص الرئيسي */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🔌 لا يوجد اتصال بالإنترنت
        </h1>
        
        <p className="text-gray-600 mb-2">
          يبدو أن اتصالك بالإنترنت قد انقطع
        </p>
        
        <p className="text-gray-500 text-sm mb-8">
          الرجاء التحقق من اتصال الشبكة والمحاولة مرة أخرى
        </p>

        {/* أزرار الإجراءات */}
        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            إعادة المحاولة
          </button>

          <Link
            href="/"
            className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            العودة للرئيسية
          </Link>
        </div>

        {/* نصائح إضافية */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">نصائح سريعة:</h3>
          <ul className="text-sm text-gray-600 text-right space-y-1">
            <li>• تحقق من كابل الشبكة أو الواي فاي</li>
            <li>• أعد تشغيل المودم أو الراوتر</li>
            <li>• تحقق من إعدادات الشبكة</li>
          </ul>
        </div>
      </div>
    </div>
  );
}