"use client";
import React, { useEffect, useState } from 'react';
import { FaFilePdf, FaExternalLinkAlt } from 'react-icons/fa';

function getDrivePreviewLink(rawUrl: string): { embedUrl: string; originalUrl: string } {
  const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = rawUrl.match(driveRegex);

  if (match && match[1]) {
    const fileId = match[1];
    return {
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: `https://drive.google.com/file/d/${fileId}/view`,
    };
  }

  return {
    embedUrl: '',
    originalUrl: rawUrl,
  };
}

const PreviewFile: React.FC = () => {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [originalUrl, setOriginalUrl] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const previewParam = params.get('preview');

    if (previewParam) {
      const { embedUrl, originalUrl } = getDrivePreviewLink(previewParam);
      setEmbedUrl(embedUrl);
      setOriginalUrl(originalUrl);
    }
  }, []);

  if (!embedUrl) {
    return (
      <div className="text-center py-8 text-red-500 text-sm">
        لا يوجد رابط Google Drive صالح للمعاينة.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
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
          <iframe
            src={embedUrl}
            title="معاينة الملف"
            className="w-full h-full"
            allow="autoplay"
          ></iframe>
        </div>

        <div className="flex justify-end mt-3 text-red-500">
          <FaFilePdf size={18} />
        </div>
      </div>
    </div>
  );
};

export default PreviewFile;
