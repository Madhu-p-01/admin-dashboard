import React from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { DashboardCards } from '../components/ui/DashboardCards';
import { Charts } from '../components/ui/Charts';

export default function DashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <div className="p-6">
        {/* Stats Cards */}
        <DashboardCards />
        
        {/* Charts */}
        <Charts />
      </div>
    </AdminLayout>
  );
}
