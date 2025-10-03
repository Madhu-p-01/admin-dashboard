import React, { useState } from 'react';

interface CustomerOrder {
  id: string;
  productName: string;
  image: string;
  size: string;
  color: string;
  orderDate: string;
  deliveredDate: string | 'Processing';
  totalPrice: string;
}

interface CustomerData {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  language: string;
  shippingAddress: string;
  billingAddress: string;
  orders: CustomerOrder[];
}

interface CustomerProfileProps {
  customer: CustomerData;
  onClose: () => void;
}

export function CustomerProfile({ customer, onClose }: CustomerProfileProps) {
  const [activeTab, setActiveTab] = useState<'order-history' | 'wishlist' | 'reviews' | 'note'>('order-history');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Customer Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Customer Info Card */}
          <div className="p-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <p className="text-center font-medium text-gray-900 mt-2">{customer.name}</p>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Language</p>
                        <p className="text-sm text-gray-600">{customer.language}</p>
                      </div>
                    </div>
                    <div className="space-y-3 mt-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Shipping Address</p>
                        <p className="text-sm text-gray-600">{customer.shippingAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Billing Address</p>
                        <p className="text-sm text-gray-600">{customer.billingAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600" title="Edit">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600" title="Delete">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <div className="border-b border-gray-200">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('order-history')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'order-history'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'wishlist'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Wishlist
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => setActiveTab('note')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'note'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Note
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content - Order History */}
          {activeTab === 'order-history' && (
            <div className="p-6">
              <div className="space-y-4">
                {customer.orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4"
                  >
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={order.image}
                        alt={order.productName}
                        className="w-24 h-24 object-cover rounded"
                      />
                      {order.deliveredDate === 'Processing' && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.productName}</p>
                        <p className="text-xs text-gray-500 mt-1">Size: {order.size}</p>
                        <p className="text-xs text-gray-500">Color: {order.color}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Order Date: {order.orderDate}</p>
                        <p className={`text-xs mt-1 ${
                          order.deliveredDate === 'Processing' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          Delivered Date: {order.deliveredDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Total Price: {order.totalPrice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button className="p-2 text-gray-400 hover:text-gray-600" title="Previous">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600" title="Next">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Other tabs content */}
          {activeTab !== 'order-history' && (
            <div className="p-6">
              <p className="text-center text-gray-500">Content for {activeTab} tab</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
