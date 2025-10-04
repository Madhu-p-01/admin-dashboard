import React, { useState, useEffect, useMemo } from 'react';

interface Discount {
  id: string;
  code: string;
  description: string;
  status: string;
  usedBy: number;
  maxUsage: number;
}

interface DiscountSearchProps {
  discounts: Discount[];
  onSearchResults: (results: Discount[]) => void;
  placeholder?: string;
  className?: string;
}

export function DiscountSearch({
  discounts,
  onSearchResults,
  placeholder = "Search discounts...",
  className = ""
}: DiscountSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced search functionality
  const filteredDiscounts = useMemo(() => {
    if (!searchQuery.trim()) {
      return discounts;
    }

    const query = searchQuery.toLowerCase().trim();

    return discounts.filter(discount => {
      return (
        discount.code.toLowerCase().includes(query) ||
        discount.description.toLowerCase().includes(query) ||
        discount.status.toLowerCase().includes(query)
      );
    });
  }, [discounts, searchQuery]);

  // Update search results when filtered discounts change
  useEffect(() => {
    onSearchResults(filteredDiscounts);
  }, [filteredDiscounts, onSearchResults]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className={`relative flex-1 ${className}`}>
      <svg
        className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full pl-10 pr-10 py-2.5 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm"
      />

      {searchQuery && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          title="Clear search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
