import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  permissions: string[];
  avatar: string;
  joinDate: string;
  phone: string;
}

export default function TeamTestSimple() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Mock team data - complete dataset
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@lily.com',
      role: 'Admin',
      department: 'IT',
      status: 'active',
      lastLogin: '2024-01-15 10:30 AM',
      permissions: ['users.read', 'users.write', 'orders.read', 'orders.write', 'products.read', 'products.write'],
      avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=3b82f6&color=fff',
      joinDate: '2023-01-15',
      phone: '+91 98765 43210'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@lily.com',
      role: 'Manager',
      department: 'Sales',
      status: 'active',
      lastLogin: '2024-01-15 09:15 AM',
      permissions: ['orders.read', 'orders.write', 'customers.read', 'analytics.read'],
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=10b981&color=fff',
      joinDate: '2023-03-20',
      phone: '+91 98765 43211'
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit.patel@lily.com',
      role: 'Editor',
      department: 'Marketing',
      status: 'active',
      lastLogin: '2024-01-14 04:45 PM',
      permissions: ['products.read', 'products.write', 'content.read', 'content.write'],
      avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=f59e0b&color=fff',
      joinDate: '2023-05-10',
      phone: '+91 98765 43212'
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@lily.com',
      role: 'Support',
      department: 'Customer Service',
      status: 'pending',
      lastLogin: 'Never',
      permissions: ['customers.read', 'orders.read'],
      avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=ef4444&color=fff',
      joinDate: '2024-01-10',
      phone: '+91 98765 43213'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      email: 'vikram.singh@lily.com',
      role: 'Analyst',
      department: 'Analytics',
      status: 'inactive',
      lastLogin: '2024-01-10 02:20 PM',
      permissions: ['analytics.read', 'reports.read'],
      avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=8b5cf6&color=fff',
      joinDate: '2023-08-15',
      phone: '+91 98765 43214'
    },
    {
      id: '6',
      name: 'Kavya Nair',
      email: 'kavya.nair@lily.com',
      role: 'Manager',
      department: 'Operations',
      status: 'active',
      lastLogin: '2024-01-15 11:00 AM',
      permissions: ['inventory.read', 'inventory.write', 'orders.read'],
      avatar: 'https://ui-avatars.com/api/?name=Kavya+Nair&background=06b6d4&color=fff',
      joinDate: '2023-06-25',
      phone: '+91 98765 43215'
    }
  ];

  // Filter functions
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const roles = ['Admin', 'Manager', 'Editor', 'Analyst', 'Support'];
  const departments = ['IT', 'Sales', 'Marketing', 'Customer Service', 'Analytics', 'Operations'];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Editor': return 'bg-green-100 text-green-800';
      case 'Analyst': return 'bg-purple-100 text-purple-800';
      case 'Support': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="Team Management">
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {teamMembers.filter(m => m.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {teamMembers.filter(m => m.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                <p className="text-gray-600">Manage your team members and their permissions</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Member
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Filter by role"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Team Members Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Team Member</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role & Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Permissions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                          <div className="text-sm text-gray-500 mt-1">{member.department}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">{member.lastLogin}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-500">
                          {member.permissions.length} permissions
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-gray-300 rounded">
                            Edit
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-gray-300 rounded">
                            Permissions
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm px-2 py-1 border border-gray-300 rounded">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {filteredMembers.length} of {teamMembers.length} members
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-500" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded">
                  1
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Role & Permission Guide */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(role => (
              <div key={role} className="p-4 border border-gray-200 rounded-lg">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getRoleColor(role)}`}>
                  {role}
                </div>
                <div className="text-sm text-gray-600">
                  {role === 'Admin' && 'Full system access including user management, system settings, and all data operations.'}
                  {role === 'Manager' && 'Access to orders, customers, analytics, and team management within their department.'}
                  {role === 'Editor' && 'Content management permissions including products, blogs, and marketing materials.'}
                  {role === 'Analyst' && 'Read-only access to analytics, reports, and business intelligence data.'}
                  {role === 'Support' && 'Customer service tools including order management and customer communication.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}