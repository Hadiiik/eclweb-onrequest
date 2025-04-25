"use client";
import React, { useState } from 'react';
import FilterPanel from './FilterPanel'; // تأكد من تعديل المسار حسب مكان المكون
import { uploadFileInfo } from '@/client/helpers/upload_file';

const FileUploadForm = () => {
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ fileName, fileUrl, fileDescription, selectedCategories });
    const result = await uploadFileInfo({
      "file_name": fileName,
      "file_description": fileDescription,
      "categories": selectedCategories,
      "file_url": fileUrl,
    });
    if (result.success) {
      alert('تم حفظ الملف بنجاح!');
      // إعادة تعيين الحقول بعد النجاح
      setFileName('');
      setFileUrl('');
      setFileDescription('');
      setSelectedCategories([]);
    } else {
      alert(`فشل حفظ الملف: ${result.error}`);
    }




  };

  const handleApplyFilters = (filters: {
    category: string;
    subject: string;
    type: string;
    year?: string;
  }) => {
    // ضبط التصنيفات المختارة كمصفوفة
    const updatedCategories = [
      filters.category, 
      filters.subject, 
      filters.type, 
      filters.year
    ].filter((item): item is string => Boolean(item)); // استخدم نوع الحماية

    setSelectedCategories(updatedCategories); // ضبطها كمصفوفة
    setShowFilterPanel(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-600 mb-4">إدخال بيانات الملف</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">اسم الملف</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">رابط تحميل الملف</label>
          <input
            type="url"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">وصف الملف (اختياري)</label>
          <textarea
            value={fileDescription}
            onChange={(e) => setFileDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">تعيين تصنيفات الملف</label>
          <button
            type="button"
            onClick={() => setShowFilterPanel(true)}
            className="mt-1 w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            عرض التصنيفات
          </button>
          <div className="mt-2 text-gray-600">
            {selectedCategories.length > 0 ? `تم اختيار: ${selectedCategories.join(', ')}` : 'لا توجد تصنيفات مختارة.'}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          حفظ الملف
        </button>
      </form>

      {showFilterPanel && (
        <FilterPanel
          onClose={() => setShowFilterPanel(false)}
          onApplyFilters={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default FileUploadForm;