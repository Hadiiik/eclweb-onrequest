"use client";

import { useEffect, useState } from "react";
import Search from "./Search";
import SearchResults, { FileData } from "./SearchResults";
import { fetchSearchResults } from "@/client/helpers/search_files";
import ToastNotification from "./ToastNotification";
import { rankBySimilarity } from "@/client/helpers/rankBySimilarity";
import FloatingNewsLink from "./FloatingNewsLink";
type Filters = {
  category: string[];
  subject: string[];
  type: string[];
  year: string[];
  location?: string[];
};

const SearchContainer = () => {
  useEffect(() => {
    console.log(
      "%cONREQUEST",
      "color: #fff; " +
        "background: linear-gradient(90deg, #000, #444); " +
        "font-size: 2rem; " +
        "font-weight: 900; " +
        "padding: 12px 28px; " +
        "border-radius: 14px; " +
        "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7); " +
        "letter-spacing: 3px; " +
        "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
    );

    console.log(
      "%cInstagram: %c onrequest.dev",
      "color: #fff; font-weight: bold; font-size: 16px;",
      "color: #fff; font-size: 16px; text-decoration: underline; cursor: pointer;"
    );

    console.log(
      "%cEmail: %c commerce.onrequest@gmail.com",
      "color: #fff; font-weight: bold; font-size: 16px;",
      "color: #fff; font-size: 16px; text-decoration: underline; cursor: pointer;"
    );
  }, []);

  const [Filters, setFilters] = useState<string[]>([]);
  const [results, setResult] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error_message, setError_message] = useState("يرجى إدخال البحث لعرض النتائج.");
  const [errorToast, seterrorToast] = useState(false);

  useEffect(() => {
    if (Filters.length === 0 && results.length === 0) return;
    onSearch(query);
  }, [Filters]);

  useEffect(() => {
    const storedResults = sessionStorage.getItem("searchResults");
    const storedQuery = sessionStorage.getItem("searchQuery");
    if (storedQuery) {
      setQuery(storedQuery);
    }
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      setResult(parsedResults);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("searchResults");
      sessionStorage.removeItem("searchQuery");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const onSearch = async (q: string) => {
    if (q.trim() === "" && Filters.length === 0) return;
    setLoading(true);
    const result = await fetchSearchResults({
      search_bar_query: q,
      filters: Filters,
      page: "0",
    });
    if (!result.success) {
      setError_message("لا توجد نتائج مطابقة للبحث جرب استخدام كلمات مختلفة أو استخدم فلاتر البحث المتاحة");
      seterrorToast(true);
      setLoading(false);
      return;
    }
    const data = result.data;
    if (data.length === 0)
      setError_message("لا توجد نتائج مطابقة للبحث جرب استخدام كلمات مختلفة أو استخدم فلاتر البحث المتاحة");

    type SearchResultItem = {
      file_name: string;
      file_description?: string;
      file_url: string;
      created_at?: string;
      categories?: string[];
      id?: string;
      average_rating?: number|string;
    };

    const formattedData: FileData[] = data.map((item: SearchResultItem) => ({
      fileName: item.file_name,
      description: item.file_description || "",
      fileUrl: item.file_url,
      filters: item.categories || [],
      created_at: item.created_at || "",
      id: item.id || "",
      rating: item.average_rating || 0,

    }));
    
    const sortedData = rankBySimilarity(formattedData, q);
    setResult(sortedData);

    sessionStorage.setItem("searchResults", JSON.stringify(formattedData));
    setLoading(false);
  };

  const onFilter = (filters: Filters) => {
    // دمج كل قيم الفلاتر في مصفوفة واحدة لحفظها في setFilters
    const filteredValues = [
      ...filters.category,
      ...filters.subject,
      ...filters.type,
      ...filters.year,
    ].filter((value) => value.trim() !== "");

    if (filters.location && filters.location.length > 0) {
      filteredValues.push(...filters.location.filter((loc) => loc.trim() !== ""));
    }

    if (filteredValues.length === 0) {
      setFilters([]);
    } else {
      setFilters(filteredValues);
    }
  };

  const onType = (text: string) => {
    setQuery(text);
  };

  return (
    <>
      {errorToast && (
        <ToastNotification
          onClose={() => seterrorToast(false)}
          message="تحقق من الاتصال بالشبكة وعاود المحاولة"
          isError={true}
        />
      )}
      <div className="w-full overflow-x-hidden">
        <div className="px-4 md:px-6 lg:px-8 pt-3 md:pt-4">
          <div className="mx-auto w-full max-w-3xl">
            <Search
              onSearch={onSearch}
              onFilter={onFilter}
              onType={onType}
              isSelectedFilters={Filters.length > 0}
            />
          </div>
        </div>
      </div>

      <FloatingNewsLink/>

      <div className="flex items-center justify-center">
        <div className="my-4 w-full max-w-2xl p-1">
          
          {!loading && <div dir="rtl"><SearchResults results={results} error_message={error_message} /></div>}
          
          {loading && <SearchResultsSkeleton />}
        </div>
      </div>

    </>
  );
};

export default SearchContainer;

const SearchResultsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 mt-4" dir="rtl">
      {[...Array(5)].map((_, index) => (
        <article
          key={index}
          className="group rounded-xl border border-gray-100 bg-white shadow-sm p-4 sm:p-6 animate-pulse"
        >
          {/* العنوان */}
          <div className="flex items-start gap-3 mb-3">
            <div className="h-5 bg-gray-200 rounded-md w-2/3" />
          </div>

          {/* الوصف */}
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded-md w-full" />
            <div className="h-3 bg-gray-100 rounded-md w-5/6" />
          </div>

          {/* المعلومات الإضافية */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 bg-gray-200 rounded-md w-20" />
          </div>

          {/* التصنيفات */}
          <div className="border-t border-gray-100 pt-3 mt-3">
            <div className="flex flex-wrap gap-2">
              <div className="h-6 bg-gray-200 rounded-lg w-16" />
              <div className="h-6 bg-gray-200 rounded-lg w-12" />
              <div className="h-6 bg-gray-200 rounded-lg w-20" />
            </div>
          </div>

          {/* الإجراءات */}
          <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 bg-gray-200 rounded-md" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

