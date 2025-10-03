import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { NewCustomerForm } from '../components/forms/NewCustomerForm';

// Extended customer data with full profile information
const customersData = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'Subscribed',
    emailAddress: 'name@hh.c',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: [
      {
        id: 'o1',
        productName: 'Product Name',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        size: 'XL',
        color: 'Black',
        orderDate: '11/11/2020',
        deliveredDate: 'Processing',
        totalPrice: '$1000'
      },
      {
        id: 'o2',
        productName: 'Product Name',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        size: 'XL',
        color: 'Black',
        orderDate: '11/11/2020',
        deliveredDate: '11/11/2020',
        totalPrice: '$1000'
      },
      {
        id: 'o3',
        productName: 'Product Name',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        size: 'XL',
        color: 'Black',
        orderDate: '11/11/2020',
        deliveredDate: '11/11/2020',
        totalPrice: '$1000'
      }
    ]
  },
  {
    id: '2',
    name: 'Aisha Sharma',
    email: 'Unsubscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '3',
    name: 'Aisha Sharma',
    email: 'Subscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '4',
    name: 'Aisha Sharma',
    email: 'Unsubscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '5',
    name: 'Aisha Sharma',
    email: 'Subscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '6',
    name: 'Aisha Sharma',
    email: 'Unsubscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '7',
    name: 'Aisha Sharma',
    email: 'Subscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '8',
    name: 'Aisha Sharma',
    email: 'Unsubscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '9',
    name: 'Aisha Sharma',
    email: 'Subscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '10',
    name: 'Aisha Sharma',
    email: 'Unsubscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  }
];

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customersData[0] | null>(null);
  const [view, setView] = useState<'table' | 'profile' | 'new-customer'>('table');
  const [activeTab, setActiveTab] = useState<'order-history' | 'wishlist' | 'reviews' | 'note'>('order-history');

  const handleCustomerClick = (customer: typeof customersData[0]) => {
    setSelectedCustomer(customer);
    setView('profile');
    setActiveTab('order-history');
  };

  const handleNewCustomer = () => {
    setView('new-customer');
  };

  const handleBackToTable = () => {
    setView('table');
    setSelectedCustomer(null);
  };

  const handleBack = () => {
    setView('table');
    setSelectedCustomer(null);
    setActiveTab('order-history');
  };

  return (
    <AdminLayout title="Customers">
      <div className="bg-gray-50 min-h-screen">
        {/* Combined Search/Table and Profile Container */}
        <div className="mx-6 mt-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            
            {/* Table View */}
            {view === 'table' && (
              <>
                {/* Search and Controls */}
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
                    onClick={handleNewCustomer}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-black hover:text-white border border-gray-300 rounded-lg text-sm font-medium transition-colors"
                    title="Add new discount"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Customer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Customer Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Email Subscription
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Amount Spent
                      </th>
                    </tr>
                  </thead>
                <tbody>
                  {customersData.map((customer, index) => (
                    <tr 
                      key={customer.id} 
                      onClick={() => handleCustomerClick(customer)}
                      className={`border-b border-gray-100 last:border-b-0 cursor-pointer ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                      } hover:bg-gray-200 transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            customer.email === 'Subscribed' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm text-gray-600">{customer.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {customer.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.orders}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {customer.amountSpent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
              </>
            )}

            {/* Profile View */}
            {view === 'profile' && selectedCustomer && (
              <div className="p-6">
                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Customer Profile</span>
                </button>

                {/* Customer Info Card - Centered */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1"></div>
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

                  <div className="flex items-start gap-16 max-w-3xl mx-auto">
                    {/* Avatar - Left */}
                    <div className="flex-shrink-0 text-center">
                      <img
                        src={selectedCustomer.avatar}
                        alt={selectedCustomer.name}
                        className="w-40 h-40 rounded-full object-cover mx-auto"
                      />
                      <p className="text-center font-semibold text-gray-900 mt-4 text-base">{selectedCustomer.name}</p>
                    </div>

                    {/* Customer Details - Right */}
                    <div className="flex-1 space-y-5 pt-2">
                      <div className="flex items-start">
                        <p className="text-sm font-semibold text-gray-900 w-40">Email</p>
                        <p className="text-sm text-gray-600 flex-1">{selectedCustomer.emailAddress}</p>
                      </div>
                      <div className="flex items-start">
                        <p className="text-sm font-semibold text-gray-900 w-40">Phone</p>
                        <p className="text-sm text-gray-600 flex-1">{selectedCustomer.phone}</p>
                      </div>
                      <div className="flex items-start">
                        <p className="text-sm font-semibold text-gray-900 w-40">Language</p>
                        <p className="text-sm text-gray-600 flex-1">{selectedCustomer.language}</p>
                      </div>
                      <div className="flex items-start">
                        <p className="text-sm font-semibold text-gray-900 w-40">Shipping Address</p>
                        <p className="text-sm text-gray-600 leading-relaxed flex-1">{selectedCustomer.shippingAddress}</p>
                      </div>
                      <div className="flex items-start">
                        <p className="text-sm font-semibold text-gray-900 w-40">Billing Address</p>
                        <p className="text-sm text-gray-600 leading-relaxed flex-1">{selectedCustomer.billingAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
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

                {/* Tab Content */}
                {/* Order History Tab */}
                {activeTab === 'order-history' && (
                  <div className="space-y-4">
                    {selectedCustomer.orderHistory.map((order) => (
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

                    {/* Pagination */}
                    {selectedCustomer.orderHistory.length > 0 && (
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
                    )}
                  </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                      <div key={item} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="relative">
                          <img
                            src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                            alt="Product"
                            className="w-full h-48 object-cover"
                          />
                          <button 
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                            title="Remove from wishlist"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <div className="p-3 text-center">
                          <p className="text-sm font-medium text-gray-900">Product Name</p>
                          <p className="text-xs text-gray-500 mt-1">Price: $ 1000</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">REVIEW LIST</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <select 
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          aria-label="Sort reviews"
                        >
                          <option>newest</option>
                          <option>oldest</option>
                          <option>highest rated</option>
                          <option>lowest rated</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={selectedCustomer.avatar}
                            alt={selectedCustomer.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{selectedCustomer.name}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo, elit sit amet pretium laoreet, arcu lorem faucibus purus, at dictum lorem massa vitae lectus.
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="" className="w-20 h-20 object-cover rounded" />
                          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="" className="w-20 h-20 object-cover rounded" />
                          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="" className="w-20 h-20 object-cover rounded" />
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                            Delete
                          </button>
                          <button className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Note Tab */}
                {activeTab === 'note' && (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Loyal Customer</h4>
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

                    <div className="bg-white border border-gray-300 border-dashed rounded-lg p-12 flex items-center justify-center">
                      <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600">
                        <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <span className="text-sm">Add New Note</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* New Customer Form View */}
            {view === 'new-customer' && (
              <div className="p-6">
                <NewCustomerForm onBack={handleBackToTable} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}