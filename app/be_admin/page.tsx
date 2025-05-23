"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import setAdminToken from "./set-admin-token";


const InviteAdminPage = () => {
  const router = useRouter();

useEffect(() => {
    // استدعاء Server Action ثم التوجيه بعد 2 ثانية
    setAdminToken().then(() => {
        setTimeout(() => {
            router.push("/dashboard");
        }, 2000);
    });
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4" dir="rtl">
      <div className="text-center animate-pulse">
        <div className="flex justify-center mb-4">
          <FaSpinner size={60} className="text-green-500 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-green-700 mb-4">جاري تجهيز الدعوة للإشراف...</h1>
        <p className="text-green-600">يرجى الانتظار، سيتم تحويلك تلقائيًا.</p>
      </div>
    </div>
  );
};

export default InviteAdminPage;
