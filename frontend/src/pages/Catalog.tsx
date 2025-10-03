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

// Mock catalog data
const catalogItems = [
  {
    id: '1',
    name: 'Summer Collection 2024',
    type: 'Collection',
    products: 45,
    status: 'Published',
    statusColor: '#10b981',
    visibility: 'Public',
    lastUpdated: 'Aug 15, 2024',
    createdBy: 'John Admin'
  },
  {
    id: '2',
    name: 'Women\'s Wear',
    type: 'Category',
    products: 128,
    status: 'Published',
    statusColor: '#10b981',
    visibility: 'Public',
    lastUpdated: 'Aug 10, 2024',
    createdBy: 'Sarah Manager'
  },
  {
    id: '3',
    name: 'Featured Products',
    type: 'Featured List',
    products: 12,
    status: 'Published',
    statusColor: '#10b981',
    visibility: 'Public',
    lastUpdated: 'Aug 20, 2024',
    createdBy: 'Admin'
  },
  {
    id: '4',
    name: 'Winter Collection 2024',
    type: 'Collection',
    products: 0,
    status: 'Draft',
    statusColor: '#6b7280',
    visibility: 'Private',
    lastUpdated: 'Aug 01, 2024',
    createdBy: 'Mike Editor'
  },
  {
    id: '5',
    name: 'Sale Items',
    type: 'Smart Collection',
    products: 23,
    status: 'Scheduled',
    statusColor: '#f59e0b',
    visibility: 'Public',
    lastUpdated: 'Aug 18, 2024',
    createdBy: 'Emma Admin'
  },
  {
    id: '6',
    name: 'Accessories',
    type: 'Category',
    products: 67,
    status: 'Published',
    statusColor: '#10b981',
    visibility: 'Public',
    lastUpdated: 'Aug 12, 2024',
    createdBy: 'David Manager'
  },
];

export default function CatalogPage() {
  const [activeFilters, setActiveFilters] = useState(['Published Items', 'All Types']);

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  // Define table columns
  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (name: string, row: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{row.products} products</div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (type: string) => {
        const typeColors: Record<string, string> = {
          'Collection': 'bg-blue-100 text-blue-700',
          'Category': 'bg-green-100 text-green-700',
          'Featured List': 'bg-purple-100 text-purple-700',
          'Smart Collection': 'bg-orange-100 text-orange-700'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100 text-gray-700'}`}>
            {type}
          </span>
        );
      },
    },
    {
      key: 'products',
      header: 'Products',
      render: (products: number) => (
        <span className="text-sm text-gray-900">{products} items</span>
      ),
    },
    {
      key: 'visibility',
      header: 'Visibility',
      render: (visibility: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          visibility === 'Public' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {visibility}
        </span>
      ),
    },
    {
      key: 'createdBy',
      header: 'Created By',
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
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
              tooltip: 'View',
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
      label: 'Import',
      icon: 'upload',
      onClick: () => console.log('Import'),
      variant: 'secondary' as const,
    },
    {
      label: 'Create Collection',
      icon: 'plus',
      onClick: () => console.log('Create Collection'),
      variant: 'primary' as const,
    },
  ];

  return (
    <AdminLayout title="Catalog">
      <div className="p-6">
        {/* Search Bar and Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <SearchBar
              placeholder="Search catalog items..."
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
                <span>Create Collection</span>
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
            title="Total Collections"
            value="24"
            iconName="folder"
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
          />
          <StatCard
            title="Published"
            value="18"
            iconName="eye"
            iconBgColor="bg-green-100"
            iconTextColor="text-green-600"
          />
          <StatCard
            title="Categories"
            value="12"
            iconName="grid"
            iconBgColor="bg-purple-100"
            iconTextColor="text-purple-600"
          />
          <StatCard
            title="Featured Items"
            value="45"
            iconName="star"
            iconBgColor="bg-yellow-100"
            iconTextColor="text-yellow-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <Icon name="plus" size={20} className="text-blue-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Create Collection</div>
            <div className="text-xs text-gray-500">Group products together</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
            <Icon name="grid" size={20} className="text-green-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Add Category</div>
            <div className="text-xs text-gray-500">Organize product types</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
            <Icon name="star" size={20} className="text-purple-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Featured List</div>
            <div className="text-xs text-gray-500">Highlight top products</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors">
            <Icon name="zap" size={20} className="text-orange-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Smart Collection</div>
            <div className="text-xs text-gray-500">Auto-update based on rules</div>
          </button>
        </div>

        {/* Catalog Table */}
        <div>
          <PageHeader
            title="All Catalog Items"
            actions={headerActions}
          />
          <DataTable
            columns={columns}
            data={catalogItems}
            onSort={(key) => console.log('Sort by:', key)}
          />
        </div>
      </div>
    </AdminLayout>
  );
}