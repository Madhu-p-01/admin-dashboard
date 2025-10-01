import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable } from '../components/ui/DataTable';
import { CustomAvatar } from '../components/ui/CustomAvatar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActionButtons } from '../components/ui/ActionButtons';
import { Icon } from '../components/ui/Icon';

// Mock abandoned checkout data
const abandonedCheckouts = [
  {
    id: '#53200002',
    products: 8,
    date: 'Jan 10, 2025',
    customer: {
      name: 'Aisha Sharma',
      avatar: 'AS',
      color: '#f59e0b'
    },
    total: '₹80.76',
    stage: 'Shipping Details',
    status: 'Not Recovered',
    statusColor: '#ef4444'
  },
  {
    id: '#53200002',
    products: 8,
    date: 'Jan 10, 2025',
    customer: {
      name: 'Aisha Sharma',
      avatar: 'AS',
      color: '#f59e0b'
    },
    total: '₹80.76',
    stage: 'Payment Page',
    status: 'Completed Later',
    statusColor: '#10b981'
  },
  {
    id: '#53200002',
    products: 8,
    date: 'Jan 10, 2025',
    customer: {
      name: 'Aisha Sharma',
      avatar: 'AS',
      color: '#f59e0b'
    },
    total: '₹80.76',
    stage: 'Shipping Details',
    status: 'Completed Later',
    statusColor: '#10b981'
  },
  {
    id: '#53200002',
    products: 8,
    date: 'Jan 10, 2025',
    customer: {
      name: 'Aisha Sharma',
      avatar: 'AS',
      color: '#f59e0b'
    },
    total: '₹80.76',
    stage: 'Cart Review',
    status: 'Not Recovered',
    statusColor: '#ef4444'
  },
  {
    id: '#53200002',
    products: 8,
    date: 'Jan 10, 2025',
    customer: {
      name: 'Aisha Sharma',
      avatar: 'AS',
      color: '#f59e0b'
    },
    total: '₹80.76',
    stage: 'Other',
    status: 'Reminder Sent',
    statusColor: '#6b7280'
  },
  {
    id: '#53200002',
    products: 8,
    date: 'Jan 10, 2025',
    customer: {
      name: 'Aisha Sharma',
      avatar: 'AS',
      color: '#f59e0b'
    },
    total: '₹80.76',
    stage: 'Shipping Details',
    status: 'Reminder Sent',
    statusColor: '#6b7280'
  },
  {
    id: '#53200002',
    products: 8,
    date: 'Jan 10, 2025',
    customer: {
      name: 'Aisha Sharma',
      avatar: 'AS',
      color: '#f59e0b'
    },
    total: '₹80.76',
    stage: 'Cart Review',
    status: 'Completed Later',
    statusColor: '#10b981'
  },
  {
    id: '#53200002',
    products: 8,
    date: 'Jan 10, 2025',
    customer: {
      name: 'Aisha Sharma',
      avatar: 'AS',
      color: '#f59e0b'
    },
    total: '₹80.76',
    stage: 'Other',
    status: 'Not Recovered',
    statusColor: '#ef4444'
  },
];

export default function AbandonedCheckoutPage() {
  // Define table columns
  const columns = [
    {
      key: 'id',
      header: 'Checkout ID',
      width: '140px',
      render: (value: string) => (
        <span className="text-sm font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'products',
      header: 'Products',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <CustomAvatar
            initials="1"
            color="#e5e7eb"
            size="sm"
            className="text-gray-600"
          />
          <span className="text-sm text-gray-600">{value} Items</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      render: (customer: any) => (
        <div className="flex items-center gap-3">
          <CustomAvatar
            initials={customer.avatar}
            color={customer.color}
            size="md"
          />
          <span className="text-sm text-gray-900">{customer.name}</span>
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      width: '100px',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'stage',
      header: 'Stage',
      width: '140px',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '140px',
      sortable: true,
      render: (status: string, row: any) => (
        <StatusBadge
          status={status}
          customColor={row.statusColor}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '100px',
      render: () => (
        <ActionButtons
          actions={[
            {
              iconName: 'edit',
              onClick: () => console.log('Edit'),
              tooltip: 'Edit',
            },
            {
              iconName: 'trash',
              onClick: () => console.log('Delete'),
              tooltip: 'Delete',
              variant: 'danger',
            },
            {
              iconName: 'more-horizontal',
              onClick: () => console.log('More'),
              tooltip: 'More options',
            },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminLayout title="Abandoned Checkout">
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
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  <span className="text-green-500 text-xs">+30%</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">30%</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">at Cart Review</div>
            <button className="text-xs text-gray-500 hover:text-gray-700 mt-2 underline">
              View report
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  <span className="text-green-500 text-xs">+40%</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">40%</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">at Shipping Details</div>
            <button className="text-xs text-gray-500 hover:text-gray-700 mt-2 underline">
              View report
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  <span className="text-green-500 text-xs">+20%</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">20%</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">at Payment Step</div>
            <button className="text-xs text-gray-500 hover:text-gray-700 mt-2 underline">
              View report
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  <span className="text-green-500 text-xs">+10%</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">10%</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">Others</div>
            <button className="text-xs text-gray-500 hover:text-gray-700 mt-2 underline">
              View report
            </button>
          </div>
        </div>

        {/* Abandoned Checkouts Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <DataTable
            columns={columns}
            data={abandonedCheckouts}
            onSort={(key) => console.log('Sort by:', key)}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
