import Link from 'next/link';
import { FaDownload, FaCalendarAlt, FaTags, FaChevronDown, FaChevronUp,FaEye } from 'react-icons/fa';
import { useState } from 'react';
import RatingDisplay from './RatingDisplay';
import ReportProblem from './ReportProblem';

export interface FileData {
  fileName: string;
  fileUrl: string;
  description?: string;
  filters?: string[];
  created_at?: string;
  id?: string;
}

interface SearchResultsProps {
  results: FileData[];
  error_message?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, error_message }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        {error_message || "لا توجد نتائج مطابقة للبحث"}
      </div>
    );
  }
  // حالة: لدينا نتائج
  return (
    <div className="mt-4 space-y-4" dir="rtl">
      {results?.map((result, index) => (
        <SearchResultItem key={index} result={result} />
      ))}
    </div>
  );
};


// مكون منفصل لكل نتيجة بحث
const SearchResultItem: React.FC<{ result: FileData }> = ({ result }) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const maxVisibleTags = 3;

  const toggleTags = () => {
    setShowAllTags(!showAllTags);
  };

  return (
    <article className="group rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <Link
        href={{
          pathname: '/preview',
          query: {
            pre: encodeURIComponent(result.fileUrl),
            nm: encodeURIComponent(result.fileName),
            desc: encodeURIComponent(result.description || ''),
            ca: encodeURIComponent(result.created_at || ''),
            id: encodeURIComponent(result.id || ''),
          },
        }}
        className="block no-underline"
      >
        <div className="p-4 sm:p-6 text-right">
          {/* العنوان مع أيقونة */}
          <div className="flex items-start gap-3 mb-3">
            <h3 className="text-lg font-bold text-gray-800 leading-snug break-words flex-1">
              {result.fileName}
            </h3>
          </div>

          {/* الوصف */}
          {result.description && (
            <p className="mt-3 text-sm leading-relaxed text-gray-600 break-words line-clamp-2">
              {result.description}
            </p>
          )}

          {/* المعلومات الإضافية */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            {/* التاريخ */}
            {result.created_at && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FaCalendarAlt size={12} />
                <time dateTime={result.created_at}>
                  {formatArabicDate(result.created_at)}
                </time>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* قسم التصنيفات */}
      {result.filters && result.filters.length > 0 && (
        <div className="px-4 sm:px-6 pb-3 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaTags size={14} className="text-blue-500" />
              <span>التصنيفات</span>
              <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {result.filters.length}
              </span>
            </div>
            
            {result.filters.length > maxVisibleTags && (
              <button
                onClick={toggleTags}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                aria-expanded={showAllTags}
              >
                {showAllTags ? (
                  <>
                    <span>إخفاء</span>
                    <FaChevronUp size={10} />
                  </>
                ) : (
                  <>
                    <span>عرض الكل</span>
                    <FaChevronDown size={10} />
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {result.filters
              .slice(0, showAllTags ? result.filters.length : maxVisibleTags)
              .map((filter, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  {filter}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* قسم الإجراءات */}
      <div className="px-4 pb-4 sm:px-6 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* التقييم */}
            <RatingDisplay rating={0} />

          </div>
          
          <div className="flex items-center gap-2">

            <Link
              href={{
                pathname: "/preview",
                query: {
                  pre: encodeURIComponent(result.fileUrl),
                  nm: encodeURIComponent(result.fileName),
                  desc: encodeURIComponent(result.description || ""),
                  ca: encodeURIComponent(result.created_at || ""),
                  id: encodeURIComponent(result.id || ""),
                },
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 active:bg-emerald-700 transition-colors"
              aria-label={`معاينة ${result.fileName}`}
            >
              <FaEye size={16} />
            </Link>
            {/* زر التحميل */}
            <a
              href={getDirectDownloadLink(result.fileUrl)}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 active:bg-emerald-700 transition-colors"
              download
              aria-label={`تحميل ${result.fileName}`}
            >
              <FaDownload size={15} />
            </a>
            {/* زر الإبلاغ عن مشكلة */}
            <ReportProblem id={result.id} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default SearchResults;

function getDirectDownloadLink(url: string): string {
  const driveFileRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//;
  const match = url.match(driveFileRegex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

function formatArabicDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;

  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}