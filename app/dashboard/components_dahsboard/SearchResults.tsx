"use client";
import ToastNotification from '@/app/components/ToastNotification';
import { deleteFile } from '@/client/helpers/deletefile';
import { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';

export interface FileData {
  fileName: string;
  fileUrl: string;
  description?: string;
  filters?: string[];
  created_at?: string;
  file_id?: string;
}

interface SearchResultsProps {
  results: FileData[];
  error_message?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, error_message }) => {


    const [isOpen, setIsOpen] = useState(false);
    const [deltedfilename, setDeletedFileName] = useState("");
    const [deletedFileId, setDeletedFileId] = useState("");
    const [deletedFileIds, setDeletedFileIds] = useState<string[]>([]);
    const [showSuccsesToast , setShowSuccsesToast] = useState(false);
    const [showErrorToast , setShowErrorToast] = useState(false);

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        {error_message || "لا توجد نتائج مطابقة للبحث"}
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">

    {
        showSuccsesToast && <ToastNotification message="تم حذف الملف بنجاح" onClose={()=>setShowSuccsesToast(false)}/>
    }
    {
        showErrorToast && <ToastNotification message="حدث خطأ أثناء حذف الملف" onClose={()=>setShowErrorToast(false)} isError={true}/>
    }

        {isOpen && (
            <ConfirmDeleteModal
            isOpen={isOpen}
            fileName={deltedfilename}
            onCancel={() => setIsOpen(false)}
            onConfirm={async () => {
              setIsOpen(false);
              setDeletedFileIds((prev) => [...prev, deletedFileId]);
              try {
                // Handle delete confirmation
              const result = await deleteFile(deletedFileId);
                if (result.success) {
                    // Handle successful deletion (e.g., show a success message, refresh the list, etc.)
                    setShowSuccsesToast(true);
                } else {
                    // Handle deletion error (e.g., show an error message)
                    setDeletedFileIds((prev) => prev.filter(id => id !== deletedFileId));
                    setShowErrorToast(true);
                }
              } catch (error) {
                setDeletedFileIds((prev) => prev.filter(id => id !== deletedFileId));
                setShowErrorToast(true);
                console.error("Error deleting file:", error);
              }
                
            }}
            fileid={""}
            />
        )}
      {results
      .filter((result) => !deletedFileIds.includes(result.file_id!))
      .map((result, index) => (
        <div
          key={index}
          className="flex flex-col p-4  border border-green-200 rounded-lg bg-white hover:bg-green-50 transition-colors duration-200 shadow-md"
        >
          <div className="flex items-center justify-between">
            {/* زر التحميل على اليسار */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
                setDeletedFileName(result.fileName);
                setDeletedFileId(result.file_id!);
              }}
              className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <FaTrashAlt className="text-red-500" size={16} />
            </button>
            {/* المحتوى منحاز لليمين */}
            <button 
                onClick={() => {
                localStorage.setItem("selectedFile", JSON.stringify(result));
                window.location.href = "/dashboard/SearchEdit/edit";
              }}
             className="flex-1 ml-4 min-w-0 no-underline">
              <div className="flex items-center cursor-pointer">
                <div className="text-right flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                    {result.fileName}
                  </h3>
                  {result.description && (
                    <p className="text-gray-500 text-xs mt-1">
                      {result.description}
                    </p>
                  )}
                  {result.created_at && (
                    <div className="">
                      <span className="text-green-400 text-xs">
                        تاريخ الاصدار:{" "}
                        {(() => {
                          const date = new Date(result.created_at!);
                          const monthsAr = [
                            "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
                            "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
                          ];
                          const day = date.getDate();
                          const month = monthsAr[date.getMonth()];
                          const year = date.getFullYear();
                          return `${day} ${month} ${year}`;
                        })()}
                      </span>
                    </div>
                  )}
                  {result.filters && result.filters.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 justify-end">
                      {result.filters.map((filter, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {filter}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mr-2 text-red-500">
                  {/* <FaFilePdf size={18} /> */}
                </div>
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;





interface ConfirmDeleteModalProps {
  isOpen: boolean;
  fileName: string;
  onCancel: () => void;
  onConfirm: () => void;
  fileid: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  fileName,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-xs ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">تأكيد الحذف</h2>
        <p className="text-sm text-gray-600 mb-6">
          هل أنت متأكد أنك تريد حذف الملف <span className="font-semibold">{fileName}</span>؟
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};


