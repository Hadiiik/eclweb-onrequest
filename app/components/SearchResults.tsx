import { FaFilePdf, FaDownload } from 'react-icons/fa';

export interface FileData {
  fileName: string;
  fileUrl: string;
  description?: string;
  filters? : string[];
}

interface SearchResultsProps {
  results: FileData[];
  error_message?:string
}

const SearchResults: React.FC<SearchResultsProps> = ({ results ,error_message}) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        {
          error_message||"لا توجد نتائج مطابقة للبحث"
        }
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-3">
      {results.map((result, index) => (
        <div 
          key={index}
          className="flex flex-col p-2 border border-green-200 rounded-full bg-white hover:bg-green-50 transition-colors duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            {/* زر التحميل على اليسار */}
            <a
              href={result.fileUrl}
              rel="noopener noreferrer"
              className="flex items-center px-2 py-1 text-xs bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
            >
              <FaDownload className="ml-1" size={10} />
            </a>
            
            {/* المحتوى منحاز لليمين */}
            <div className="flex items-center">
              <div className="text-right flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                  {result.fileName}
                </h3>
                {result.description && (
                  <p className="text-gray-500 text-xs whitespace-normal overflow-visible">
                    {result.description}
                  </p>
                )}
              </div>
              
              <div className="mr-2 text-red-500">
                <FaFilePdf size={16} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;




