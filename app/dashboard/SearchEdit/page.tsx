"use client";
import Header from "@/app/components/Header";
import { useCallback } from "react";
import Search from "@/app/components/Search";
import { fetchSearchResults } from "@/client/helpers/search_files";
import { useState, useRef, useEffect } from "react";
import SearchResults, { FileData } from "../components_dahsboard/SearchResults";


export default function Page() {
  return (
    <div className="flex flex-col gap-8"> {/* أو استخدم gap-y-8 للتباعد العمودي فقط */}
      <Header />
      <SearchContainer />
    </div>
  );
}





type filters = {
    category: string;
    subject: string;
    type: string;
};

const SearchContainer = () => {
    const [Filters, setFilters] = useState<string[]>([]);
    const [results, setResult] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [error_message, setError_message] = useState("يرجى إدخال  البحث لعرض النتائج.");

    const previousQuery = useRef<string>("");
    const previousFilters = useRef<string[]>([]);


    const onSearch = useCallback(async (q: string) => {
        const filtersChanged = JSON.stringify(previousFilters.current) !== JSON.stringify(Filters);
        const queryChanged = previousQuery.current !== q;

        if (!filtersChanged && !queryChanged) return; // skip redundant search

        setLoading(true);
        const result = await fetchSearchResults({
            search_bar_query: q,
            filters: Filters,
            page: "0"
        });

        if (!result.success) {
            setError_message("لا توجد نتائج مطابقة للبحث");
            alert("error");
            setLoading(false);
            return;
        }

        const data = result.data;
        if (data.length === 0)
            setError_message("لا توجد نتائج مطابقة للبحث");

       const formattedData: FileData[] = data.map((item: {
        file_name: string;
        file_description?: string;
        file_url: string;
        categories?: string[];
        created_at?: string;
    }) => ({
        fileName: item.file_name,
        description: item.file_description || "",
        fileUrl: item.file_url,
        filters: item.categories || [],
        created_at: item.created_at || ""
    }));


        setResult(formattedData);
        setLoading(false);

        // Update refs
        previousQuery.current = q;
        previousFilters.current = [...Filters];
    }, [Filters]);

    useEffect(() => {
        // Avoid re-fetching if filters and query haven’t changed
        if (
            Filters.length === 0 &&
            results.length === 0
        ) return;

        const filtersChanged = JSON.stringify(previousFilters.current) !== JSON.stringify(Filters);
        const queryChanged = previousQuery.current !== query;
        if (filtersChanged || queryChanged) {
            onSearch(query);
        }

    }, [Filters, onSearch, query, results.length]);

    const onFilter = (filters: filters) => {
        const filteredValues = Object.values(filters).filter(value => value.trim() !== "");
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
            <div className="px-4">
                <Search
                    onSearch={onSearch}
                    onFilter={onFilter}
                    onType={onType}
                    isSelectedFilters={Filters.length > 0}
                />
            </div>
            <div className="p-4 my-4 mx-3">
                {!loading &&
                    <SearchResults results={results} error_message={error_message} />
                }
                {loading &&
                    <SearchResultsSkeleton />
                }
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