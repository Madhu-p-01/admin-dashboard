import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { FilterPill } from '../components/ui/FilterPill';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CustomAvatar } from '../components/ui/CustomAvatar';
import { ActionButtons } from '../components/ui/ActionButtons';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable } from '../components/ui/DataTable';
import { PageHeader } from '../components/ui/PageHeader';
import { Icon } from '../components/ui/Icon';

// Mock customer data
const customers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    orders: 12,
    totalSpent: '₹25,670',
    status: 'Active',
    statusColor: '#10b981',
    joinDate: 'Jan 15, 2024',
    avatar: 'JD',
    avatarColor: '#3b82f6'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    phone: '+91 87654 32109',
    orders: 8,
    totalSpent: '₹18,420',
    status: 'Active',
    statusColor: '#10b981',
    joinDate: 'Feb 20, 2024',
    avatar: 'SW',
    avatarColor: '#f59e0b'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    phone: '+91 76543 21098',
    orders: 5,
    totalSpent: '₹12,350',
    status: 'Inactive',
    statusColor: '#6b7280',
    joinDate: 'Mar 10, 2024',
    avatar: 'MJ',
    avatarColor: '#8b5cf6'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    phone: '+91 65432 10987',
    orders: 15,
    totalSpent: '₹32,800',
    status: 'VIP',
    statusColor: '#f59e0b',
    joinDate: 'Dec 05, 2023',
    avatar: 'ED',
    avatarColor: '#ef4444'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.b@example.com',
    phone: '+91 54321 09876',
    orders: 3,
    totalSpent: '₹8,750',
    status: 'New',
    statusColor: '#3b82f6',
    joinDate: 'Apr 22, 2024',
    avatar: 'DB',
    avatarColor: '#10b981'
  },
];

export default function CustomersPage() {
  const [activeFilters, setActiveFilters] = useState(['Active Customers', 'Last 30 days']);

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  // Define table columns
  const columns = [
    {
      key: 'customer',
      header: 'Customer',
      render: (customer: any, row: any) => (
        <div className="flex items-center gap-3">
          <CustomAvatar
            initials={row.avatar}
            color={row.avatarColor}
            size="md"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'orders',
      header: 'Orders',
      render: (value: number) => (
        <span className="text-sm text-gray-900">{value} orders</span>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'joinDate',
      header: 'Join Date',
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
              iconName: 'more-horizontal',
              onClick: () => console.log('More'),
              tooltip: 'More options',
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
      label: 'Import',
      icon: 'upload',
      onClick: () => console.log('Import'),
      variant: 'secondary' as const,
    },
    {
      label: 'Add Customer',
      icon: 'plus',
      onClick: () => console.log('Add Customer'),
      variant: 'primary' as const,
    },
  ];

  return (
    <AdminLayout title="Customers">
      <div className="p-6">
        {/* Search Bar and Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <SearchBar
              placeholder="Search customers..."
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
                <span>Add Customer</span>
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
            title="Total Customers"
            value="2,847"
            iconName="users"
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
          />
          <StatCard
            title="Active Customers"
            value="2,340"
            iconName="user-check"
            iconBgColor="bg-green-100"
            iconTextColor="text-green-600"
          />
          <StatCard
            title="New This Month"
            value="186"
            iconName="user-plus"
            iconBgColor="bg-purple-100"
            iconTextColor="text-purple-600"
          />
          <StatCard
            title="VIP Customers"
            value="89"
            iconName="crown"
            iconBgColor="bg-yellow-100"
            iconTextColor="text-yellow-600"
          />
        </div>

        {/* Customers Table */}
        <div>
          <PageHeader
            title="All Customers"
            actions={headerActions}
          />
          <DataTable
            columns={columns}
            data={customers}
            onSort={(key) => console.log('Sort by:', key)}
          />
        </div>
      </div>
    </AdminLayout>
  );
}