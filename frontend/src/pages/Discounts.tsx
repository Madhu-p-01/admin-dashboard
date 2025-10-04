import React, { useState, useMemo, useEffect } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { NewDiscountForm } from '../components/forms/NewDiscountForm';
import { DiscountSearch } from '../components/ui/DiscountSearch';
import { DiscountFilterDropdown } from '../components/ui/DiscountFilterDropdown';
import { DiscountSortDropdown } from '../components/ui/DiscountSortDropdown';
import { ImportExportDiscount } from '../components/ui/ImportExportDiscount';

// Mock discount data matching the image
const discountsData = [
  {
    id: '1',
    code: 'GET 5',
    description: '5% off entire order',
    status: 'Active',
    usedBy: 20,
    maxUsage: 100,
  },
  {
    id: '2',
    code: 'SAVE10',
    description: '10% off on orders above ₹500',
    status: 'Active',
    usedBy: 15,
    maxUsage: 50,
  },
  {
    id: '3',
    code: 'FREESHIP',
    description: 'Free shipping on all orders',
    status: 'Inactive',
    usedBy: 5,
    maxUsage: 30,
  },
  {
    id: '4',
    code: 'WELCOME',
    description: '15% off for new customers',
    status: 'Expired',
    usedBy: 100,
    maxUsage: 100,
  },
];

export default function DiscountsPage() {
  const [view, setView] = useState<'grid' | 'new-discount'>('grid');
  const [discounts, setDiscounts] = useState(discountsData);
  const [filteredDiscounts, setFilteredDiscounts] = useState(discountsData);
  const [displayedDiscounts, setDisplayedDiscounts] = useState(discountsData);

  // Filter and Sort states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});
  const [currentSort, setCurrentSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);

  // Notification states
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'error' | 'info'}>>([]);

  // Notification function
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, {id, message, type}]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Filter configuration for discounts
  const filterGroups = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'active', label: 'Active', count: discounts.filter(d => d.status.toLowerCase() === 'active').length },
        { id: 'inactive', label: 'Inactive', count: discounts.filter(d => d.status.toLowerCase() === 'inactive').length },
        { id: 'expired', label: 'Expired', count: discounts.filter(d => d.status.toLowerCase() === 'expired').length },
      ]
    }
  ];

  // Sort options for discounts
  const sortOptions = [
    { id: 'code-asc', label: 'Code (A-Z)', field: 'code', direction: 'asc' as const },
    { id: 'code-desc', label: 'Code (Z-A)', field: 'code', direction: 'desc' as const },
    { id: 'usedBy-asc', label: 'Used By (Low to High)', field: 'usedBy', direction: 'asc' as const },
    { id: 'usedBy-desc', label: 'Used By (High to Low)', field: 'usedBy', direction: 'desc' as const },
    { id: 'maxUsage-asc', label: 'Max Usage (Low to High)', field: 'maxUsage', direction: 'asc' as const },
    { id: 'maxUsage-desc', label: 'Max Usage (High to Low)', field: 'maxUsage', direction: 'desc' as const },
  ];

  // Apply filters and sorting
  const processedDiscounts = useMemo(() => {
    let result = [...filteredDiscounts];

    // Apply filters
    Object.entries(appliedFilters).forEach(([groupId, selectedOptions]) => {
      if (selectedOptions.length > 0) {
        switch (groupId) {
          case 'status':
            result = result.filter(discount => {
              return selectedOptions.some(option => {
                return discount.status.toLowerCase() === option;
              });
            });
            break;
        }
      }
    });

    // Apply sorting
    if (currentSort) {
      result.sort((a, b) => {
        let aValue: string | number = '';
        let bValue: string | number = '';

        switch (currentSort.field) {
          case 'code':
            aValue = a.code.toLowerCase();
            bValue = b.code.toLowerCase();
            break;
          case 'usedBy':
            aValue = a.usedBy;
            bValue = b.usedBy;
            break;
          case 'maxUsage':
            aValue = a.maxUsage;
            bValue = b.maxUsage;
            break;
          default:
            return 0;
        }

        if (currentSort.direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return result;
  }, [filteredDiscounts, appliedFilters, currentSort]);

  // Update displayed discounts when processed discounts change
  useEffect(() => {
    setDisplayedDiscounts(processedDiscounts);
  }, [processedDiscounts]);

  // Handlers
  const handleSearchResults = (results: typeof discountsData) => {
    setFilteredDiscounts(results);
  };

  const handleApplyFilters = (filters: Record<string, string[]>) => {
    setAppliedFilters(filters);
  };

  const handleSortChange = (sort: { field: string; direction: 'asc' | 'desc' }) => {
    setCurrentSort(sort);
  };

  const handleImport = (importedDiscounts: typeof discountsData) => {
    const newDiscounts = [...discounts, ...importedDiscounts];
    setDiscounts(newDiscounts);
    setFilteredDiscounts(newDiscounts);
    showNotification(`Successfully imported ${importedDiscounts.length} discounts`, 'success');
  };

  const handleAddDiscount = (newDiscount: any) => {
    const discount = {
      id: Date.now().toString(),
      code: newDiscount.discountCode,
      description: `${newDiscount.discountValue}${newDiscount.discountType === 'Percentage' ? '%' : newDiscount.discountType === 'Fixed Amount' ? '₹' : ''} off`,
      status: 'Active',
      usedBy: 0,
      maxUsage: parseInt(newDiscount.totalUsageLimit || '100', 10),
    };
    const newDiscounts = [...discounts, discount];
    setDiscounts(newDiscounts);
    setFilteredDiscounts(newDiscounts);
    showNotification('Discount added successfully', 'success');
  };

  const handleNewDiscount = () => {
    setView('new-discount');
  };

  const handleBackToGrid = () => {
    setView('grid');
  };

  return (
    <AdminLayout title="Discounts">
      {/* Notification Display */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div key={notification.id} className={`p-4 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
            {notification.message}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 min-h-screen">
        {/* Main Container */}
        <div className="mx-6 mt-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Grid View */}
            {view === 'grid' && (
              <>
                {/* Search and Controls Bar */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <DiscountSearch
                      discounts={discounts}
                      onSearchResults={handleSearchResults}
                      placeholder="Search discounts..."
                    />

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 relative">
                      {/* Filter Button */}
                      <div className="relative">
                        <button
                          onClick={() => setIsFilterOpen(!isFilterOpen)}
                          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                          title="Filter"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                          {Object.values(appliedFilters).flat().length > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {Object.values(appliedFilters).flat().length}
                            </span>
                          )}
                        </button>

                        <DiscountFilterDropdown
                          isOpen={isFilterOpen}
                          onClose={() => setIsFilterOpen(false)}
                          filters={filterGroups}
                          appliedFilters={appliedFilters}
                          onApplyFilters={handleApplyFilters}
                        />
                      </div>

                      {/* Sort Button */}
                      <div className="relative">
                        <button
                          onClick={() => setIsSortOpen(!isSortOpen)}
                          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                          title="Sort"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                          {currentSort && (
                            <span className="bg-blue-600 text-white text-xs rounded-full w-2 h-2"></span>
                          )}
                        </button>

                        <DiscountSortDropdown
                          isOpen={isSortOpen}
                          onClose={() => setIsSortOpen(false)}
                          options={sortOptions}
                          currentSort={currentSort}
                          onSortChange={handleSortChange}
                        />
                      </div>

                      {/* Import/Export */}
                      <ImportExportDiscount
                        discounts={displayedDiscounts}
                        onImport={handleImport}
                      />

                      {/* Add Discount Button */}
                      <button
                        onClick={handleNewDiscount}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-black hover:text-white border border-gray-300 rounded-lg text-sm font-medium transition-colors"
                        title="Add new discount"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Discount</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Discount Cards Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedDiscounts.map((discount) => (
                      <div key={discount.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow">
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{discount.code}</h3>
                            <p className="text-sm text-gray-600">{discount.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${discount.status.toLowerCase() === 'active' ? 'bg-green-500' : discount.status.toLowerCase() === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-medium text-gray-900">{discount.status}</span>
                          </div>
                        </div>

                        {/* Usage Statistics */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Used by</span>
                            <span className="text-sm font-semibold text-gray-900">{discount.usedBy}</span>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
                            <div
                              className="bg-blue-500 h-2 rounded-full absolute top-0 left-0 transition-all"
                              style={{ width: `${Math.round((discount.usedBy / discount.maxUsage) * 100)}%` } as React.CSSProperties}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* New Discount Form View */}
            {view === 'new-discount' && (
              <NewDiscountForm onBack={handleBackToGrid} onAdd={handleAddDiscount} />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
