import { useEffect, useState } from "react";
import Link from "next/link";
import { FiFileText } from 'react-icons/fi'; // أيقونة الأخبار من react-icons

export default function FloatingNewsLink() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // التمرير لأسفل => إخفاء
        setShow(false);
      } else {
        // التمرير لأعلى => إظهار
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-transform duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <Link href="/news">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
          style={{ backgroundColor: "#006f3c" }}
        >
          <FiFileText className="w-7 h-7 text-white" />
        </div>
      </Link>
    </div>
  );
}