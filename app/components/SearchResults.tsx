import Link from 'next/link';
import { FaDownload } from 'react-icons/fa';

export interface FileData {
  fileName: string;
  fileUrl: string;
  description?: string;
  filters?: string[];
  created_at?: string;
  id?: string; // Assuming fileUrl is the ID
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

  return (
    <div className="space-y-4 mt-4" >
      {results.map((result, index) => (
        <div
          key={index}
          className="flex flex-col p-4 border border-green-200 rounded-lg bg-white hover:bg-green-50 transition-colors duration-200 shadow-md"
        >
          <div className="flex items-center justify-between">
            {/* زر التحميل على اليسار */}
            <a
              href={getDirectDownloadLink(result.fileUrl)}
              rel="noopener noreferrer"
              className="flex items-center px-3 py-1 text-xs bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
              onClick={e => e.stopPropagation()} // Prevent card click
              onMouseDown={e => e.stopPropagation()}
              download
            >
              <FaDownload className="ml-1" size={12} />
            </a>

            {/* المحتوى منحاز لليمين */}
              <Link
              href={{
                pathname: '/preview',
                query: {
                  pre: encodeURIComponent(result.fileUrl),
                  nm: encodeURIComponent(result.fileName),
                  desc: encodeURIComponent(result.description || ''),
                  ca: encodeURIComponent(result.created_at || ''),
                  id: encodeURIComponent(result.id||''), // Assuming fileUrl is the ID
                },
              }}
              className="flex-1 ml-4 min-w-0 no-underline"
            >

              <div className="flex items-center cursor-pointer">
                <div className="text-right flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-800 break-words">
                    {result.fileName}
                    </h3>
                  {result.description && (
                    <p className="text-gray-500 text-xs mt-1 break-words" dir='rtl'>
                      {result.description}
                    </p>
                  )}
                  {result.created_at && (
                    <div className="">
                      <span className="text-green-500 text-xs">
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
            </Link>
          </div>
        </div>
      ))}
    </div>
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
