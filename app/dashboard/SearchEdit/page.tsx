"use client";
import Header from "@/app/components/Header";
import Search from "@/app/components/Search";
import { fetchSearchResults } from "@/client/helpers/search_files";
import { useState, useEffect } from "react";
import SearchResults, { FileData } from "../components_dahsboard/SearchResults";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <Header />
      <SearchContainer />
    </div>
  );
}

type Filters = {
  category: string[];
  subject: string[];
  type: string[];
  year: string[];
  location?: string[];
};

const SearchContainer = () => {
  const [filters, setFilters] = useState<Filters>({
    category: [],
    subject: [],
    type: [],
    year: [],
    location: [],
  });
  const [results, setResult] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error_message, setError_message] = useState("يرجى إدخال  البحث لعرض النتائج.");

  useEffect(() => {
    // نفذ البحث فقط إذا هناك فلتر واحد على الأقل أو نص البحث ليس فارغًا
    if (
      query.trim() === "" &&
      filters.category.length === 0 &&
      filters.subject.length === 0 &&
      filters.type.length === 0 &&
      filters.year.length === 0 &&
      (filters.location?.length === 0 || !filters.location)
    )
      return;

    onSearch(query);
  }, [filters]);

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
    if (
      q.trim() === "" &&
      filters.category.length === 0 &&
      filters.subject.length === 0 &&
      filters.type.length === 0 &&
      filters.year.length === 0 &&
      (filters.location?.length === 0 || !filters.location)
    )
      return;

    setLoading(true);
    const result = await fetchSearchResults({
      search_bar_query: q,
      filters: [
        ...filters.category,
        ...filters.subject,
        ...filters.type,
        ...filters.year,
        ...(filters.location || []),
      ],
      page: "0",
    });

    if (!result.success) {
      setError_message("لا توجد نتائج مطابقة للبحث");
      setLoading(false);
      return;
    }

    const data = result.data;
    if (data.length === 0) setError_message("لا توجد نتائج مطابقة للبحث");

    type SearchResultItem = {
      file_name: string;
      file_description?: string;
      file_url: string;
      created_at?: string;
      categories?: string[];
      id?: string;
    };

    const formattedData: FileData[] = data.map((item: SearchResultItem) => ({
      fileName: item.file_name,
      description: item.file_description || "",
      fileUrl: item.file_url,
      filters: item.categories || [],
      created_at: item.created_at || "",
      file_id: item.id || "",
    }));
    setResult(formattedData);
    sessionStorage.setItem("searchResults", JSON.stringify(formattedData));
    sessionStorage.setItem("searchQuery", q);
    setLoading(false);
  };

  const onFilter = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const onType = (text: string) => {
    setQuery(text);
  };

  return (
    <>
      <div className="px-4">
        <Search onSearch={onSearch} onFilter={onFilter} onType={onType} isSelectedFilters={filters.category.length > 0 || filters.subject.length > 0 || filters.type.length > 0 || filters.year.length > 0 || (filters.location && filters.location.length > 0)} />
      </div>
      <div className="p-4 my-4 mx-3">
        {!loading && <SearchResults results={results} error_message={error_message} />}
        {loading && <SearchResultsSkeleton />}
      </div>
    </>
  );
};

const SearchResultsSkeleton: React.FC = () => {
  return (
    <div className="space-y-2 mt-3">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 border border-green-100 rounded-full bg-white animate-pulse shadow-sm"
        >
          <div className="flex-1 mr-2 mx-3.5">
            <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-1" />
            <div className="h-3 bg-gray-100 rounded-md w-1/2" />
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
};
