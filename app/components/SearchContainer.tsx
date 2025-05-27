"use client"

import { useEffect, useState } from "react";
import Search from "./Search"
import SearchResults, { FileData } from "./SearchResults"
import { fetchSearchResults } from "@/client/helpers/search_files";
import ToastNotification from "./ToastNotification";
type filters = {
    category: string;
    subject: string;
    type: string;
  }
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

},[])



        
    const [Filters,setFilters] = useState<string[]>([]);
    const [results,setResult] = useState<FileData[]>([]);
    const [loading,setLoading] = useState(false);
    const [query,setQuery] = useState("");
    const [error_message, setError_message] = useState("يرجى إدخال  البحث لعرض النتائج.");
    const [errorToast,seterrorToast] = useState(false);


    useEffect(()=>{
        if (Filters.length === 0 && results.length === 0)
            return;
        console.log(query)
        onSearch(query)
        
    },[Filters])
    useEffect(()=>{
        const storedResults = sessionStorage.getItem("searchResults");
        const storedQuery = sessionStorage.getItem("searchQuery");
        if (storedQuery) { 
            setQuery(storedQuery);
        }
        if (storedResults) {
            const parsedResults = JSON.parse(storedResults);
            setResult(parsedResults);
        } 
    }
    ,[])

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

    const onSearch = async (q:string)=>{
      if(q.trim() == ""&&Filters.length == 0) return;
        setLoading(true);
        const result = await fetchSearchResults({
            search_bar_query:q,
            filters:Filters,
            page : "0"
        });
        if(!result.success){
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
        };

        const formattedData: FileData[] = data.map((item: SearchResultItem) => ({
            fileName: item.file_name,
            description: item.file_description || "",
            fileUrl: item.file_url,
            filters: item.categories || [],
            created_at:item.created_at||"",
            id: item.id || ""
        }));
        setResult(formattedData);
        sessionStorage.setItem("searchResults", JSON.stringify(formattedData));
        // sessionStorage.setItem("searchQuery", q);
        setLoading(false);

    }

    const onFilter = (filters: filters) => {
        const filteredValues = Object.values(filters).filter(value => value.trim() !== "");
        if (filteredValues.length === 0) {
            setFilters([]);
        } else {
            setFilters(filteredValues);
        }
    }
    
    const onType = (text:string)=>{
        setQuery(text);
    }
    



  return (
    <>
    {
      errorToast&&
      <ToastNotification onClose={()=>seterrorToast(false)} message="تحقق من الاتصال بالشبكة وعاود المحاولة" isError={true}/>
    }
    <div className="px-4"> {/* إضافة padding جانبي للبحث على الهواتف */}
        <Search
            onSearch={onSearch} 
            onFilter={onFilter}
            onType={onType}
            isSelectedFilters={Filters.length > 0} 
        />
    </div>
    <div className="p-4 my-4 mx-3"> {/* إضافة هوامش داخلية وخارجية مناسبة */} 
        {!loading&&
            <SearchResults results={results}  error_message={error_message}/>
        }
        {loading&&
            <SearchResultsSkeleton />
        }
    </div>
    </>
  )
}

export default SearchContainer;





const SearchResultsSkeleton: React.FC = () => {
    return (
      <div className="space-y-2 mt-3">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border border-green-100 rounded-full bg-white animate-pulse shadow-sm"
          >
            {/* شكل مستطيل مكان النص */}
            <div className="flex-1 mr-2 mx-3.5">
              <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-1" />
              <div className="h-3 bg-gray-100 rounded-md w-1/2" />
            </div>
  
            {/* دائرة تمثل الأيقونة */}
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    );
  };
  