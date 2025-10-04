import React from 'react';
import { cn } from '../../lib/utils';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

function ChartCard({ title, children, actions, className }: ChartCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 p-6",
      className
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actions && <div>{actions}</div>}
      </div>
      {children}
    </div>
  );
}

function RevenueChart() {
  return (
    <ChartCard
      title="Revenue"
      actions={
        <div className="flex items-center gap-4">
          <select className="px-3 py-1 border border-gray-200 rounded-md text-sm">
            <option>This week</option>
            <option>This month</option>
            <option>This year</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-blue-600">Orders</span>
          </label>
        </div>
      }
      className="lg:col-span-2"
    >
      <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-6xl">📈</div>
      </div>
    </ChartCard>
  );
}

function VisitorsTrendsChart() {
  return (
    <ChartCard title="Visitors Trends">
      <div className="h-64 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🍩</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">75%</div>
          <div className="text-sm text-gray-600">New Visitors</div>
        </div>
        <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>New Visitors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <span>Returning</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

function MostSoldItemsChart() {
  const items = [
    { name: 'Top', percentage: 75 },
    { name: 'Shirts', percentage: 35 },
    { name: 'Pants', percentage: 85 },
    { name: 'Kurthi', percentage: 75 }
  ];

  return (
    <ChartCard
      title="Most Sold Items"
      actions={
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs">
            Daily
          </button>
          <button className="px-3 py-1 border border-gray-200 text-gray-600 rounded-full text-xs">
            Weekly
          </button>
          <button className="px-3 py-1 border border-gray-200 text-gray-600 rounded-full text-xs">
            Monthly
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-gray-900">{item.name}</span>
              <span className="text-gray-600">{item.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

function ProductsAddedGrid() {
  const products = [
    'Black Bodycon Dress',
    'Pink Bodycon Dress',
    'Floral Pink Dress',
    'Light Blue Dress'
  ];

  return (
    <ChartCard
      title="Products Added"
      actions={
        <div className="flex gap-2">
          <button className="w-8 h-8 bg-blue-500 text-white rounded-md flex items-center justify-center text-sm">
            +
          </button>
          <button className="w-8 h-8 bg-gray-100 text-gray-600 rounded-md flex items-center justify-center">
            ⋯
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        {products.map((name, index) => (
          <div key={index} className="text-center">
            <div className="w-full h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-2xl">
              👗
            </div>
            <div className="text-xs text-gray-900 mb-1">{name}</div>
            <div className="text-xs text-gray-600">₹1270</div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <button className="text-sm text-blue-600 hover:text-blue-700">
          View All
        </button>
        <div className="flex gap-1">
          <button className="w-6 h-6 bg-gray-100 rounded border flex items-center justify-center text-gray-600 text-xs">
            ‹
          </button>
          <button className="w-6 h-6 bg-gray-100 rounded border flex items-center justify-center text-gray-600 text-xs">
            ›
          </button>
        </div>
      </div>
    </ChartCard>
  );
}

export function Charts() {
  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <VisitorsTrendsChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MostSoldItemsChart />
        <ProductsAddedGrid />
      </div>
    </div>
  );
}
