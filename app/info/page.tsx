"use client";

import React from 'react';

const InfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10" dir="rtl">
      <div className="max-w-md w-full bg-gray-50 border border-green-100 rounded-xl shadow-lg p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-green-600">ECL WEB</h1>

        <p className="text-gray-700 text-sm leading-relaxed">
          جميع الحقوق محفوظة لصالح فريق <span className="font-semibold text-green-600">ECL</span> © {new Date().getFullYear()}
        </p>

        <p className="text-gray-700 text-sm leading-relaxed">
            تم تطوير هذا المشروع من قِبل <span className="font-semibold text-green-600">الفريق التقني OnRequest</span>، وفق أعلى معايير الجودة والاهتمام بالتفاصيل.
        </p>

        <div className="text-gray-700 text-sm leading-relaxed">
          للتواصل مع الفريق التقني:
          <br />
          <a
            href="mailto:commerce.onrequest@gmail.com"
            className="text-green-600 hover:underline"
          >
            commerce.onrequest@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
