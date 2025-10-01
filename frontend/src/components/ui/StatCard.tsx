import React from 'react';
import { Icon } from './Icon';

interface StatCardProps {
  title: string;
  value: string | number;
  iconName: string;
  iconBgColor?: string;
  iconTextColor?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function StatCard({ 
  title, 
  value, 
  iconName, 
  iconBgColor = 'bg-blue-100',
  iconTextColor = 'text-blue-600',
  change,
  changeType = 'neutral'
}: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center ml-4`}>
          <Icon name={iconName} size={20} className={iconTextColor} />
        </div>
      </div>
    </div>
  );
}
