import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { SearchBar } from '../components/ui/SearchBar';
import { Icon } from '../components/ui/Icon';

// Mock product data based on LILY design
const products = [
  {
    id: '1',
    name: 'Off-White Trousers',
    category: 'Bottoms',
    price: 2110.40,
    currency: '₹',
    image: '/placeholder-product.jpg',
    sales: 1269,
    salesTrend: 'up',
    remainingProducts: 1000,
    summary: 'Lorem ipsum is placeholder text commonly used in the graphic.'
  },
  {
    id: '2',
    name: 'Off-White Trousers',
    category: 'Bottoms',
    price: 2110.40,
    currency: '₹',
    image: '/placeholder-product.jpg',
    sales: 1269,
    salesTrend: 'up',
    remainingProducts: 1000,
    summary: 'Lorem ipsum is placeholder text commonly used in the graphic.'
  },
  {
    id: '3',
    name: 'Off-White Trousers',
    category: 'Bottoms',
    price: 2110.40,
    currency: '₹',
    image: '/placeholder-product.jpg',
    sales: 1269,
    salesTrend: 'up',
    remainingProducts: 1000,
    summary: 'Lorem ipsum is placeholder text commonly used in the graphic.'
  },
  {
    id: '4',
    name: 'Off-White Trousers',
    category: 'Bottoms',
    price: 2110.40,
    currency: '₹',
    image: '/placeholder-product.jpg',
    sales: 1269,
    salesTrend: 'up',
    remainingProducts: 1000,
    summary: 'Lorem ipsum is placeholder text commonly used in the graphic.'
  },
  {
    id: '5',
    name: 'Off-White Trousers',
    category: 'Bottoms',
    price: 2110.40,
    currency: '₹',
    image: '/placeholder-product.jpg',
    sales: 1269,
    salesTrend: 'up',
    remainingProducts: 1000,
    summary: 'Lorem ipsum is placeholder text commonly used in the graphic.'
  },
  {
    id: '6',
    name: 'Off-White Trousers',
    category: 'Bottoms',
    price: 2110.40,
    currency: '₹',
    image: '/placeholder-product.jpg',
    sales: 1269,
    salesTrend: 'up',
    remainingProducts: 1000,
    summary: 'Lorem ipsum is placeholder text commonly used in the graphic.'
  },
];

export default function ProductsNewPage() {
  return (
    <AdminLayout title="Products">
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <SearchBar
              placeholder="Search"
              className="w-80"
              onChange={(value) => console.log('Search:', value)}
            />
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Icon name="filter" size={16} />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Icon name="sort" size={16} />
                <span>Sort</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span>Export</span>
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Icon name="plus" size={16} />
                <span>Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="relative bg-gray-100 aspect-[4/3] flex items-center justify-center">
                <div className="absolute top-3 right-3">
                  <button className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                    <Icon name="more-horizontal" size={16} className="text-gray-600" />
                  </button>
                </div>
                {/* Placeholder for product image */}
                <div className="w-32 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Icon name="image" size={48} className="text-gray-400" />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                </div>

                <div className="text-xl font-bold text-gray-900 mb-3">
                  {product.currency}{product.price.toFixed(2)}
                </div>

                {/* Summary */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Summary</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.summary}
                  </p>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sales</span>
                    <div className="flex items-center gap-2">
                      <Icon 
                        name="trending-up" 
                        size={14} 
                        className="text-green-500" 
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {product.sales}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Remaining Products</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: '60%' }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {product.remainingProducts}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
