"use client";

import FilterPanel from "@/app/components/FilterPanel";
import Header from "@/app/components/Header";
import ToastNotification from "@/app/components/ToastNotification";
import { updateFileInfo } from "@/client/helpers/update_file";
import { useEffect, useState } from "react";

const FileUploadForm = () => {
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [fileid, setFileId] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showerrortoast,setShowerrortoast] = useState(false);
  const [isloading, setIsLoading] = useState(false); 

    useEffect(() => {
    const savedFile = localStorage.getItem("selectedFile");
    if (savedFile) {
      try {
        const parsed = JSON.parse(savedFile);
        if (parsed.fileName) setFileName(parsed.fileName);
        if (parsed.fileUrl) setFileUrl(parsed.fileUrl);
        if (parsed.description) setFileDescription(parsed.description);
        if(parsed.file_id) setFileId(parsed.file_id);
        if (parsed.filters && Array.isArray(parsed.filters)) {
          setSelectedCategories(parsed.filters);
        }
      } catch (e) {
        console.error("تعذر تحليل بيانات الملف من localStorage", e);
      }
    }
  }, []);



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    const result = await updateFileInfo({
      "file_name": fileName,
      "file_description": fileDescription,
      "categories": selectedCategories,
      "file_url": fileUrl,
      "file_id": fileid
    });
    if (result.success) {
      setIsLoading(false)
      setShowToast(true)
      // إعادة تعيين الحقول بعد النجاح
    } else {
      setIsLoading(false)
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
      ...(filters.location || []),
    ];

    setSelectedCategories(updatedCategories);
    setShowFilterPanel(false);
  };

  return (
    <>
    <Header/>
    <div className="max-w-md  p-4 bg-white rounded-lg shadow-md mx-auto mt-10 ">
    {
      showToast&&<ToastNotification message='تم تعديل الملف بنجاح' onClose={()=>setShowToast(false)} />
    }
    {
      showerrortoast&&<ToastNotification message='فشل تعديل الملف' onClose={()=>setShowerrortoast(false)} isError={true} />
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
            style={{ minHeight: '40px', overflow: 'hidden', height: 'auto' }}
            ref={el => {
              if (el) {
          el.style.height = 'auto';
          el.style.height = `${el.scrollHeight}px`;
              }
            }}
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
            style={{ minHeight: '40px', maxHeight: '200px', overflow: 'hidden', height: 'auto' }}
            ref={el => {
              if (el) {
          el.style.height = 'auto';
          el.style.height = `${el.scrollHeight}px`;
              }
            }}
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
          {isloading ? "جار التحميل..." : "تعديل الملف"}
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