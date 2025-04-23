"use client";

import React, { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import FilterPanel from './FilterPanel'; 

interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilter?: (filters: {
    category: string;
    subject: string;
    type: string;
  }) => void;
  onType? : (text:string) => void
}

const Search: React.FC<SearchProps> = ({
  placeholder = 'ابحث هنا...',
  onSearch,
  onFilter,
  onType
}) => {
  const [query, setQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleFilterClick = () => {
    setShowFilterPanel(true);
  };

  const handleApplyFilters = (filters: {
    category: string;
    subject: string;
    type: string;
  }) => {
    onFilter?.(filters);
    setShowFilterPanel(false);
  };
  

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="w-full max-w-md mx-auto"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              onType?.(e.target.value)
            }}
            placeholder={placeholder}
            className="w-full py-2 px-4 pr-20 rounded-full border-2 border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600 transition-all duration-200 md:text-base text-sm"
            dir="rtl"
          />
          
          <button
            type="submit"
            className="absolute left-3 text-green-600 hover:text-green-700 focus:outline-none"
            aria-label="بحث"
          >
            <FiSearch className="md:size-5 size-4" />
          </button>
          
          <button
            type="button"
            onClick={handleFilterClick}
            className="absolute left-10 text-green-600 hover:text-green-700 focus:outline-none"
            aria-label="فلتر"
          >
            <FiFilter className="md:size-5 size-4" />
          </button>
        </div>
      </form>

      {showFilterPanel && (
        <FilterPanel
          onClose={() => setShowFilterPanel(false)}
          onApplyFilters={handleApplyFilters}
        />
      )}
    </>
  );
};

export default Search;