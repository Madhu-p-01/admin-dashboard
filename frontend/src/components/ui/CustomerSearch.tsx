import React, { useState, useEffect, useMemo } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  emailAddress: string;
  phone: string;
  language: string;
  location: string;
  orders: string;
  amountSpent: string;
  avatar: string;
  shippingAddress: string;
  billingAddress: string;
  orderHistory: Array<{
    id: string;
    productName: string;
    image: string;
    size: string;
    color: string;
    orderDate: string;
    deliveredDate: string;
    totalPrice: string;
  }>;
}

interface CustomerSearchProps {
  customers: Customer[];
  onSearchResults: (results: Customer[]) => void;
  placeholder?: string;
  className?: string;
}

export function CustomerSearch({ 
  customers, 
  onSearchResults, 
  placeholder = "Search customers...",
  className = ""
}: CustomerSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced search functionality
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) {
      return customers;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return customers.filter(customer => {
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.emailAddress.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.location.toLowerCase().includes(query) ||
        customer.language.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
      );
    });
  }, [customers, searchQuery]);

  // Update search results when filtered customers change
  useEffect(() => {
    onSearchResults(filteredCustomers);
  }, [filteredCustomers, onSearchResults]);

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