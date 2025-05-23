// components/ToastNotification.tsx
"use client";
import { useEffect, useState } from "react";

interface ToastNotificationProps {
  message: string;
  duration?: number; // مدة العرض بالملي ثانية (افتراضي 3000)
  onClose?: () => void;
  isError?: boolean; // تغيير اللون عند الخطأ
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  duration = 3000,
  onClose,
  isError = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setVisible(true); // بدء أنميشن الدخول

    const timer = setTimeout(() => {
      setExiting(true); // بدء أنميشن الخروج
      setTimeout(() => {
        setVisible(false); // إخفاء العنصر
        if (onClose) onClose();
      }, 300); // مدة أنميشن الخروج
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg z-50 text-white transition-all duration-300 ease-in-out
        ${exiting ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}
        ${isError ? "bg-red-500" : "bg-green-500"}
      `}
    >
      {message}
    </div>
  );
};

export default ToastNotification;
