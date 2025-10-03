import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { FilterPill } from '../components/ui/FilterPill';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActionButtons } from '../components/ui/ActionButtons';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable } from '../components/ui/DataTable';
import { PageHeader } from '../components/ui/PageHeader';
import { Icon } from '../components/ui/Icon';

// Mock discount data
const discounts = [
  {
    id: '1',
    code: 'SAVE20',
    title: '20% Off Summer Sale',
    type: 'Percentage',
    value: '20%',
    minOrder: '₹500',
    maxDiscount: '₹2000',
    usage: '245/1000',
    status: 'Active',
    statusColor: '#10b981',
    startDate: 'Jun 01, 2024',
    endDate: 'Aug 31, 2024'
  },
  {
    id: '2',
    code: 'FLAT100',
    title: 'Flat ₹100 Off',
    type: 'Fixed Amount',
    value: '₹100',
    minOrder: '₹999',
    maxDiscount: '₹100',
    usage: '89/500',
    status: 'Active',
    statusColor: '#10b981',
    startDate: 'Jul 15, 2024',
    endDate: 'Sep 15, 2024'
  },
  {
    id: '3',
    code: 'NEWUSER',
    title: 'New User Welcome',
    type: 'Percentage',
    value: '15%',
    minOrder: '₹299',
    maxDiscount: '₹500',
    usage: '1240/∞',
    status: 'Active',
    statusColor: '#10b981',
    startDate: 'Jan 01, 2024',
    endDate: 'Dec 31, 2024'
  },
  {
    id: '4',
    code: 'EXPIRED50',
    title: '50% Mega Sale',
    type: 'Percentage',
    value: '50%',
    minOrder: '₹1000',
    maxDiscount: '₹5000',
    usage: '500/500',
    status: 'Expired',
    statusColor: '#ef4444',
    startDate: 'May 01, 2024',
    endDate: 'May 31, 2024'
  },
  {
    id: '5',
    code: 'WINTER25',
    title: 'Winter Collection',
    type: 'Percentage',
    value: '25%',
    minOrder: '₹750',
    maxDiscount: '₹1500',
    usage: '0/800',
    status: 'Scheduled',
    statusColor: '#f59e0b',
    startDate: 'Dec 01, 2024',
    endDate: 'Feb 28, 2025'
  },
];

export default function DiscountsPage() {
  const [activeFilters, setActiveFilters] = useState(['Active Discounts', 'All Types']);

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  // Define table columns
  const columns = [
    {
      key: 'code',
      header: 'Discount Code',
      render: (code: string, row: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{code}</div>
          <div className="text-sm text-gray-500">{row.title}</div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (type: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          type === 'Percentage' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {type}
        </span>
      ),
    },
    {
      key: 'value',
      header: 'Value',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'minOrder',
      header: 'Min Order',
    },
    {
      key: 'usage',
      header: 'Usage',
      render: (usage: string) => {
        const [used, total] = usage.split('/');
        const percentage = total === '∞' ? 0 : (parseInt(used) / parseInt(total)) * 100;
        return (
          <div className="w-full">
            <div className="text-sm text-gray-900 mb-1">{usage}</div>
            {total !== '∞' && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'endDate',
      header: 'Expires',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
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
              iconName: 'eye',
              onClick: () => console.log('View'),
              tooltip: 'View Details',
            },
            {
              iconName: 'edit',
              onClick: () => console.log('Edit'),
              tooltip: 'Edit',
            },
            {
              iconName: 'copy',
              onClick: () => console.log('Duplicate'),
              tooltip: 'Duplicate',
            },
            {
              iconName: 'trash',
              onClick: () => console.log('Delete'),
              tooltip: 'Delete',
              variant: 'danger',
            },
          ]}
        />
      ),
    },
  ];

  // Table header actions
  const headerActions = [
    {
      label: 'Export',
      icon: 'download',
      onClick: () => console.log('Export'),
      variant: 'secondary' as const,
    },
    {
      label: 'Bulk Edit',
      icon: 'edit',
      onClick: () => console.log('Bulk Edit'),
      variant: 'secondary' as const,
    },
    {
      label: 'Create Discount',
      icon: 'plus',
      onClick: () => console.log('Create Discount'),
      variant: 'primary' as const,
    },
  ];

  return (
    <AdminLayout title="Discounts">
      <div className="p-6">
        {/* Search Bar and Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <SearchBar
              placeholder="Search discount codes..."
              className="w-80"
              onChange={(value) => console.log('Search:', value)}
            />
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg">
                <Icon name="filter" size={16} />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg">
                <Icon name="download" size={16} />
                <span>Export</span>
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Icon name="plus" size={16} />
                <span>Create Discount</span>
              </button>
            </div>
          </div>
          
          {/* Active Filters */}
          <div className="flex items-center gap-2">
            {activeFilters.map((filter, index) => (
              <FilterPill
                key={index}
                label={filter}
                onRemove={() => removeFilter(filter)}
              />
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Discounts"
            value="28"
            iconName="percent"
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
          />
          <StatCard
            title="Active Discounts"
            value="12"
            iconName="check-circle"
            iconBgColor="bg-green-100"
            iconTextColor="text-green-600"
          />
          <StatCard
            title="Total Savings"
            value="₹1,24,350"
            iconName="trending-down"
            iconBgColor="bg-purple-100"
            iconTextColor="text-purple-600"
          />
          <StatCard
            title="Most Used"
            value="SAVE20"
            iconName="star"
            iconBgColor="bg-yellow-100"
            iconTextColor="text-yellow-600"
          />
        </div>

        {/* Discounts Table */}
        <div>
          <PageHeader
            title="All Discount Codes"
            actions={headerActions}
          />
          <DataTable
            columns={columns}
            data={discounts}
            onSort={(key) => console.log('Sort by:', key)}
          />
        </div>
      </div>
    </AdminLayout>
  );
}