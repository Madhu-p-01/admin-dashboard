import React from 'react';
import { cn } from '../../lib/utils';
import { Icon } from './Icon';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendPositive: boolean;
  icon: React.ReactNode;
  className?: string;
}

function StatCard({ title, value, trend, trendPositive, icon, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 p-6 shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            {icon}
          </div>
          <span className="text-sm text-gray-600">{title}</span>
        </div>
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          trendPositive 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        )}>
          {trend}
        </div>
      </div>
      
      <div className="text-2xl font-bold text-gray-900 mb-4">
        {value}
      </div>
      
      <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
        View report
      </button>
    </div>
  );
}

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Net Income"
        value="₹7,825"
        trend="+21%"
        trendPositive={true}
        icon={<Icon name="settings" size={20} className="text-gray-600" />}
      />
      <StatCard
        title="Total Revenue"
        value="₹7,825"
        trend="+21%"
        trendPositive={true}
        icon={<Icon name="export" size={20} className="text-gray-600" />}
      />
      <StatCard
        title="Orders"
        value="740"
        trend="+15%"
        trendPositive={true}
        icon={<Icon name="shopping-cart" size={20} className="text-gray-600" />}
      />
      <StatCard
        title="Conversion"
        value="28%"
        trend="+5%"
        trendPositive={true}
        icon={<Icon name="percent" size={20} className="text-gray-600" />}
      />
    </div>
  );
}
