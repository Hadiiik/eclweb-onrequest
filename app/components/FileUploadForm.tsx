"use client";
import React, { useState } from 'react';
import FilterPanel from './FilterPanel'; // تأكد من تعديل المسار حسب مكان المكون
import { uploadFileInfo } from '@/client/helpers/upload_file';
import ToastNotification from './ToastNotification';

const FileUploadForm = () => {
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showerrortoast,setShowerrortoast] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setFileName('');
    setFileUrl('');
    setFileDescription('');
    setSelectedCategories([]);
    const result = await uploadFileInfo({
      "file_name": fileName,
      "file_description": fileDescription,
      "categories": selectedCategories,
      "file_url": fileUrl,
    });
    if (result.success) {
      setIsLoading(false);
      setShowToast(true)
      // إعادة تعيين الحقول بعد النجاح
    } else {
      setIsLoading(false);
     setShowerrortoast(true)
    }




  };

  const handleApplyFilters = (filters: {
    category: string[];
    subject: string[];
    type: string[];
    year: string[];
    location?: string[];
  }) => {
    // دمج جميع التصنيفات المختارة في مصفوفة واحدة
    const updatedCategories = [
      ...(filters.category || []),
      ...(filters.subject || []),
      ...(filters.type || []),
      ...(filters.year || []),
      ...(filters.location || [])
    ].flat();

    setSelectedCategories(updatedCategories as string[]);
    setShowFilterPanel(false);
  };

  return (
    <>
    <div className="max-w-md  p-4 bg-white rounded-lg shadow-md mx-auto mt-10 ">
    {
      showToast&&<ToastNotification message='تم رفع الملف بنجاح' onClose={()=>setShowToast(false)} />
    }
    {
      showerrortoast&&<ToastNotification message='فشل رفع الملف' onClose={()=>setShowerrortoast(false)} isError={true} />
    }
    <div className=''>
      <h2 className="text-2xl font-bold text-green-600 mb-4">إدخال بيانات الملف</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">اسم الملف</label>
          <textarea
            maxLength={100}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
            rows={1}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
            style={{ minHeight: '40px', overflow: 'hidden' }}
            onInput={e => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
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
          maxLength={200}
            value={fileDescription}
            onChange={(e) => setFileDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
            rows={1}
            style={{ minHeight: '40px', overflow: 'hidden' }}
            onInput={e => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
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
          disabled={isloading}
        >
          {isloading ? 'جار حفظ الملف...' : 'حفظ الملف'}
        </button>
      </form>

      {showFilterPanel && (
        <FilterPanel
          onClose={() => setShowFilterPanel(false)}
          onApplyFilters={handleApplyFilters}
          setIsOpen={() => setShowFilterPanel(true)}
        />
      )}
    </div>
    </div>
    </>
  );
};

export default FileUploadForm;