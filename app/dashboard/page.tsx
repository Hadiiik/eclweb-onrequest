"use client";

import Link from "next/link";
import { FiUpload, FiSearch } from "react-icons/fi";
import { FaFileAlt } from "react-icons/fa";
import Header from "../components/Header";




const Dashboard = () => {
  return (
    <>
    <Header/>
    <div className="p-6 space-y-6" dir="rtl">
      {/* <h1 className="text-2xl font-bold text-green-700 mb-4">لوحة التحكم</h1> */}

      {/* Badge عدد الملفات */}
      <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
        <FaFileAlt className="mr-2" />
        عدد الملفات: {140}
      </div>
    <p className="text-sm text-gray-500 mt-2">
         قد يتأخر عدد الملفات الفعلي في الظهور عدة دقائق من التحديث.
    </p>

      {/* روابط المهام */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link href="dashboard/DataEnterance" className="block">
          <div className="bg-green-50 border border-green-200 hover:border-green-400 rounded-lg p-5 shadow-sm hover:shadow-md transition cursor-pointer text-center">
            <FiUpload size={24} className="mx-auto text-green-600 mb-2" />
            <span className="text-green-800 font-semibold text-lg">إضافة ملف جديد</span>
          </div>
        </Link>

        <Link href="dashboard/SearchEdit" className="block">
          <div className="bg-green-50 border border-green-200 hover:border-green-400 rounded-lg p-5 shadow-sm hover:shadow-md transition cursor-pointer text-center">
            <FiSearch size={24} className="mx-auto text-green-600 mb-2" />
            <span className="text-green-800 font-semibold text-lg">البحث وتعديل الملفات</span>
          </div>
        </Link>

      </div>
    </div>
    </>
  );
};

export default Dashboard;
