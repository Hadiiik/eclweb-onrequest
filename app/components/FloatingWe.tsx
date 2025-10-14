"use client";

import { useState } from "react";
import { FaWhatsapp, FaTelegram, FaFacebookF, FaYoutube, FaInstagram, FaTwitter, FaUsers } from "react-icons/fa";
import { FiMic } from "react-icons/fi";

export default function FloatingSocialButton() {
  const [open, setOpen] = useState(false);

  const socials = [
    {
      name: "واتس اب",
      icon: <FaWhatsapp />,
      color: "#25D366",
      link: "https://whatsapp.com/channel/0029VaDNR4VIiRou3CyWzC0M/?utm_medium=social&utm_source=heylink.me",
    },
    {
      name: "X",
      icon: <FaTwitter />,
      color: "#1DA1F2",
      link: "https://x.com/ecl_co?t=10uLXRxhOjNxDcQs_ZPLHA&s=09&utm_medium=social&utm_source=heylink.me",
    },
    {
      name: "تلغرام",
      icon: <FaTelegram />,
      color: "#0088cc",
      link: "https://telegram.me/ecl_co",
    },
    {
      name: "فيس بوك",
      icon: <FaFacebookF />,
      color: "#1877F2",
      link: "https://www.facebook.com/eclcom",
    },
    {
      name: "يوتيوب",
      icon: <FaYoutube />,
      color: "#FF0000",
      link: "https://youtube.com/@ecl_co?si=fy87SfbE-oBc56eA",
    },
    {
      name: "انستغرام",
      icon: <FaInstagram />,
      color: "#E4405F",
      link: "https://www.instagram.com/ecl_co",
    },
    {
      name: "STUvoice",
      icon: <FiMic />,
      color: "#007BFF",
      link: "https://stu-voice.vercel.app/showuserdata/ecl_co",
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center">
      {/* قائمة الايقونات */}
      <div
        className={`flex flex-col mb-3 space-y-3 transition-all duration-300 ${
          open ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-12 rounded-full text-white shadow-lg transition-transform transform hover:scale-110"
            style={{ backgroundColor: social.color }}
            title={social.name}
          >
            {social.icon}
          </a>
        ))}
      </div>

      {/* الزر الرئيسي */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors duration-200"
        title="التواصل الاجتماعي"
      >
        <FaUsers className="w-8 h-8" />
      </button>
    </div>
  );
}
