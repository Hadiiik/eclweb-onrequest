"use client"

import { useEffect, useState } from "react";
import Search from "./Search"
import SearchResults, { FileData } from "./SearchResults"
import { fetchSearchResults } from "@/client/helpers/search_files";
type filters = {
    category: string;
    subject: string;
    type: string;
  }
const SearchContainer = () => {


    
    
    const [Filters,setFilters] = useState<string[]>([]);
    const [results,setResult] = useState<FileData[]>([]);
    const [loading,setLoading] = useState(false);
    const [query,setQuery] = useState("");


    useEffect(()=>{
        if (Filters.length === 0 && results.length === 0)
            return;
        console.log(query)
        onSearch(query)
        
    },Filters)

    const onSearch = async (q:string)=>{
        setLoading(true);
        const result = await fetchSearchResults({
            search_bar_query:q,
            filters:Filters,
            page : "0"
        });
        if(!result.success){
            alert("error")
            setLoading(false);
            return;
        }
        const data = result.data;
        type SearchResultItem = {
            file_name: string;
            file_description?: string;
            file_url: string;
        };

        const formattedData: FileData[] = data.map((item: SearchResultItem) => ({
            fileName: item.file_name,
            description: item.file_description || "",
            Url: item.file_url,
        }));
        setResult(formattedData);
        setLoading(false);
        console.log(data)

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
    <div className="px-4"> {/* إضافة padding جانبي للبحث على الهواتف */}
        <Search
            onSearch={onSearch} 
            onFilter={onFilter}
            onType={onType}
        />
    </div>
    <div className="p-4 my-4 mx-3"> {/* إضافة هوامش داخلية وخارجية مناسبة */} 
        {!loading&&
            <SearchResults results={results} />
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
  
