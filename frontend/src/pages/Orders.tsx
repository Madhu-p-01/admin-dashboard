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

// Mock order data
const orders = [
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
    status: 'Process',
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
    status: 'Process',
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
    status: 'Process',
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
    status: 'Process',
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
    status: 'Process',
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
    status: 'Process',
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
    status: 'Process',
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
    status: 'Process',
    statusColor: '#10b981'
  },
];

export default function OrdersPage() {
  const [activeFilters, setActiveFilters] = useState(['Last 7 days', 'New Customers', 'Earliest Delivery']);

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  // Define table columns
  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      width: '120px',
    },
    {
      key: 'products',
      header: 'Products',
      render: (value: number) => `${value} Items`,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
    },
    {
      key: 'customer',
      header: 'Customer',
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

  // Table header actions
  const headerActions = [
    {
      label: 'Export',
      icon: 'export',
      onClick: () => console.log('Export'),
      variant: 'secondary' as const,
    },
    {
      label: 'Sort',
      icon: 'sort',
      onClick: () => console.log('Sort'),
      variant: 'secondary' as const,
    },
    {
      label: 'Orders',
      icon: 'package',
      onClick: () => console.log('Orders'),
      variant: 'primary' as const,
    },
  ];

  return (
    <AdminLayout title="Orders">
      <div className="p-6">
        {/* Search Bar and Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <SearchBar
              placeholder="Search..."
              className="w-80"
              onChange={(value) => console.log('Search:', value)}
            />
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg">
                <Icon name="filter" size={16} />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg">
                <Icon name="export" size={16} />
                <span>Export</span>
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Icon name="plus" size={16} />
                <span>Orders</span>
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
            title="Total Orders"
            value="1200"
            iconName="package"
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
          />
          <StatCard
            title="Total Delivered"
            value="800"
            iconName="check-circle"
            iconBgColor="bg-green-100"
            iconTextColor="text-green-600"
          />
          <StatCard
            title="Pending Orders"
            value="200"
            iconName="clock"
            iconBgColor="bg-yellow-100"
            iconTextColor="text-yellow-600"
          />
          <StatCard
            title="Orders Hold"
            value="20"
            iconName="lock"
            iconBgColor="bg-red-100"
            iconTextColor="text-red-600"
          />
        </div>

        {/* Orders Table with Reusable Components */}
        <div>
          <PageHeader
            title="Orders"
            actions={headerActions}
          />
          <DataTable
            columns={columns}
            data={orders}
            onSort={(key) => console.log('Sort by:', key)}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
