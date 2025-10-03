import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { NewDiscountForm } from '../components/forms/NewDiscountForm';

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
    code: 'GET 5',
    description: '5% off entire order',
    status: 'Active',
    usedBy: 20,
    maxUsage: 100,
  },
  {
    id: '3',
    code: 'GET 5',
    description: '5% off entire order',
    status: 'Active',
    usedBy: 20,
    maxUsage: 100,
  },
  {
    id: '4',
    code: 'GET 5',
    description: '5% off entire order',
    status: 'Active',
    usedBy: 20,
    maxUsage: 100,
  },
  {
    id: '5',
    code: 'GET 5',
    description: '5% off entire order',
    status: 'Active',
    usedBy: 20,
    maxUsage: 100,
  },
  {
    id: '6',
    code: 'GET 5',
    description: '5% off entire order',
    status: 'Active',
    usedBy: 20,
    maxUsage: 100,
  },
  {
    id: '7',
    code: 'GET 5',
    description: '5% off entire order',
    status: 'Active',
    usedBy: 20,
    maxUsage: 100,
  },
  {
    id: '8',
    code: 'GET 5',
    description: '5% off entire order',
    status: 'Active',
    usedBy: 20,
    maxUsage: 100,
  },
  {
    id: '9',
    code: 'GET 5',
    description: '5% off entire order',
    status: 'Active',
    usedBy: 20,
    maxUsage: 100,
  },
];

export default function DiscountsPage() {
  const [view, setView] = useState<'grid' | 'new-discount'>('grid');

  const handleNewDiscount = () => {
    setView('new-discount');
  };

  const handleBackToGrid = () => {
    setView('grid');
  };

  return (
    <AdminLayout title="Discounts">
      <div className="bg-gray-50 min-h-screen">
        {/* Main Container */}
        <div className="mx-6 mt-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">{/* eslint-disable-line */}
            
            {/* Grid View */}
            {view === 'grid' && (
              <>
                {/* Search and Controls Bar */}
                <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button 
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg text-sm"
                    title="Filter"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                  <button 
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg text-sm"
                    title="Sort"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                  <button className="px-4 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg text-sm font-medium">
                    Import
                  </button>
                  <button className="px-4 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg text-sm font-medium">
                    Export
                  </button>
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
                {discountsData.map((discount) => (
                  <div key={discount.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{discount.code}</h3>
                        <p className="text-sm text-gray-600">{discount.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
              <div className="p-6">
                <NewDiscountForm onBack={handleBackToGrid} />
              </div>
            )}

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}