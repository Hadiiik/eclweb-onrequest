"use client";
import React, { useEffect, useState } from 'react';
import { FaFilePdf, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import Header from '../components/Header';

function getDrivePreviewLink(rawUrl: string): { embedUrl: string; originalUrl: string } {
  let fileId = '';

  // نمط رابط ملف مباشر مع إمكانية وجود /view أو باراميترات إضافية
  const filePattern = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)(?:\/view)?(?:\?.*)?/;
  // نمط رابط مشاركة open?id=FILE_ID
  const openPattern = /https:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  // نمط رابط مشاركة uc?id=FILE_ID
  const ucPattern = /https:\/\/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/;

  if (filePattern.test(rawUrl)) {
    const match = rawUrl.match(filePattern);
    if (match && match[1]) fileId = match[1];
  } else if (openPattern.test(rawUrl)) {
    const match = rawUrl.match(openPattern);
    if (match && match[1]) fileId = match[1];
  } else if (ucPattern.test(rawUrl)) {
    const match = rawUrl.match(ucPattern);
    if (match && match[1]) fileId = match[1];
  }

  if (fileId) {
    return {
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: `https://drive.google.com/file/d/${fileId}/view`,
    };
  }

  // لو الرابط مجلد أو غير معروف نرجع الرابط كما هو (لا يمكن معاينته)
  return {
    embedUrl: '',
    originalUrl: rawUrl,
  };
}


const PreviewFile: React.FC = () => {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // بيانات الملف
  const [fileName, setFileName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const previewParam = params.get('pre');
    const nmParam = params.get('nm') || '';
    const descParam = params.get('desc') || '';
    const caParam = params.get('ca') || '';

    setFileName(decodeURIComponent(nmParam));
    setDescription(decodeURIComponent(descParam));
    setCreatedAt(decodeURIComponent(caParam));

    if (previewParam) {
      const decodedUrl = decodeURIComponent(previewParam);
      const { embedUrl, originalUrl } = getDrivePreviewLink(decodedUrl);
      setEmbedUrl(embedUrl);
      setOriginalUrl(originalUrl);
    } else {
      setLoading(false);
    }
  }, []);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const formatArabicDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const monthsAr = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    const day = date.getDate();
    const month = monthsAr[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <>
    <Header/>
    <div className="max-w-3xl md:mx-auto mx-4 mt-10 space-y-6" dir='rtl' >
      {/* معلومات الملف تظهر دائماً */}
      <div className={`p-4 border rounded-lg bg-white shadow-md ${embedUrl ? 'border-green-200 hover:bg-green-50' : 'border-yellow-300 bg-yellow-50'}`}>
      {fileName && (
        <p className="break-words">
        <strong>اسم الملف: </strong>
        <span className="break-words">{fileName}</span>
        </p>
      )}

      {description && (
        <p className="break-words">
        <strong>الوصف: </strong>
        <span className="break-words">{description}</span>
        </p>
      )}

      {createdAt && (
        <p>
        <strong>تاريخ الإصدار: </strong>
        <span>{formatArabicDate(createdAt)}</span>
        </p>
      )}

      {!embedUrl && (
        <p className="mt-4 text-sm text-gray-600">
        جار التحقق من رابط الملف... إذا كان الرابط صالحًا، ستظهر المعاينة قريبًا.
        </p>
      )}
      </div>

      {/* لو فيه رابط صالح نعرض المعاينة */}
      {embedUrl && (
        <div className="p-4 border border-green-200 rounded-lg bg-white shadow-md hover:bg-green-50 transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-800 truncate">
              معاينة الملف
            </h3>

            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
            >
              <FaExternalLinkAlt size={12} />
              فتح في Google Drive
            </a>
          </div>

          <div className="relative w-full h-[600px] border rounded overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                <FaSpinner className="animate-spin text-green-500" size={30} />
                <span className="mr-2 text-green-600">جاري التحميل...</span>
              </div>
            )}
            <iframe
              src={embedUrl}
              title="معاينة الملف"
              className="w-full h-full"
              allow="autoplay"
              onLoad={handleIframeLoad}
            ></iframe>
          </div>

          <div className="flex justify-end mt-3 text-red-500">
            <FaFilePdf size={18} />
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default PreviewFile;
