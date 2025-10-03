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
      "border border-gray-200 rounded-lg p-6",
      className
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
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
          <select
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none"
            aria-label="Select time range"
          >
            <option>This week</option>
            <option>This month</option>
            <option>This year</option>
          </select>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="text-gray-700 font-medium">Orders</span>
          </label>
          <button className="p-1.5 hover:bg-gray-100 rounded" title="More options">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      }
    >
      {/* Chart Area with gradient */}
      <div className="h-80 relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-4">
          <span>30K</span>
          <span>27K</span>
          <span>18K</span>
          <span>9K</span>
          <span>0</span>
        </div>
        
        {/* Chart SVG */}
        <div className="ml-12 h-full relative">
          <svg className="w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="60" x2="500" y2="60" stroke="#f3f4f6" strokeWidth="1"/>
            <line x1="0" y1="120" x2="500" y2="120" stroke="#f3f4f6" strokeWidth="1"/>
            <line x1="0" y1="180" x2="500" y2="180" stroke="#f3f4f6" strokeWidth="1"/>
            <line x1="0" y1="240" x2="500" y2="240" stroke="#f3f4f6" strokeWidth="1"/>
            
            {/* Area gradient */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
              </linearGradient>
            </defs>
            
            {/* Black line */}
            <path
              d="M0,150 Q70,140 100,120 T200,100 T300,85 T400,90 T500,80"
              fill="none"
              stroke="#1f2937"
              strokeWidth="2.5"
            />
            
            {/* Blue line */}
            <path
              d="M0,180 Q70,170 100,150 T200,130 T300,115 T400,110 T500,95"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
            />
            
            {/* Area fill */}
            <path
              d="M0,180 Q70,170 100,150 T200,130 T300,115 T400,110 T500,95 L500,300 L0,300 Z"
              fill="url(#areaGradient)"
            />
            
            {/* White dot on line at Friday position */}
            <circle cx="370" cy="105" r="5" fill="white" stroke="#1f2937" strokeWidth="3"/>
            
            {/* Tooltip */}
            <g transform="translate(370, 70)">
              <rect x="-45" y="-10" width="90" height="35" rx="8" fill="#374151"/>
              <text x="0" y="8" fill="white" fontSize="16" fontWeight="400" textAnchor="middle" dominantBaseline="middle">Fri: 18,298</text>
            </g>
          </svg>
        </div>
        
        {/* X-axis labels */}
        <div className="ml-12 flex justify-between text-xs text-gray-500 mt-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </ChartCard>
  );
}

function VisitorsTrendsChart() {
  return (
    <ChartCard 
      title="Visitors Trends"
      actions={
        <button className="p-1 hover:bg-gray-100 rounded" title="More options">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      }
    >
      <div className="h-80 flex flex-col items-center justify-center">
        {/* Donut Chart */}
        <div className="relative w-48 h-48 mb-8">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#dbeafe"
              strokeWidth="30"
            />
            {/* Blue segment (75%) */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="30"
              strokeDasharray={`${2 * Math.PI * 80 * 0.75} ${2 * Math.PI * 80}`}
              strokeLinecap="round"
            />
          </svg>
          {/* Percentage labels */}
          <div className="absolute top-4 right-0 text-sm font-medium text-gray-900">25%</div>
          <div className="absolute top-1/2 -left-6 -translate-y-1/2 text-sm font-medium text-gray-900">75%</div>
        </div>
        
        {/* Legend */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700">New Visitors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
            <span className="text-gray-700">Returning Visitors</span>
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
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700">
            Daily
          </button>
          <button className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-50">
            Weekly
          </button>
          <button className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-50">
            Monthly
          </button>
          <button className="p-1 hover:bg-gray-100 rounded ml-2" title="Previous">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded" title="Next">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-sm text-gray-900 font-medium">{item.name}</span>
              <span className="text-sm text-gray-600 font-medium">{item.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full absolute top-0 left-0"
                style={{ width: `${item.percentage}%` } as React.CSSProperties}
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
    { name: 'Black Bodycon Dress', price: '₹1270', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop' },
    { name: 'Black Bodycon Dress', price: '₹1270', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop' },
    { name: 'Black Bodycon Dress', price: '₹1270', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=200&fit=crop' },
    { name: 'Black Bodycon Dress', price: '₹1270', image: 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?w=200&h=200&fit=crop' }
  ];

  return (
    <ChartCard
      title="Products Added"
      actions={
        <div className="flex gap-2">
          <button 
            className="w-8 h-8 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700"
            title="Add product"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button 
            className="w-8 h-8 bg-gray-100 text-gray-600 rounded-md flex items-center justify-center hover:bg-gray-200"
            title="More options"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
        {products.map((product, index) => (
          <div key={index} className="text-center">
            <div className="w-full aspect-square bg-gray-100 rounded-xl mb-3 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs text-gray-900 mb-1 font-medium truncate">{product.name}</div>
            <div className="text-sm text-gray-900 font-semibold">{product.price}</div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <button className="text-sm text-gray-900 hover:text-gray-700 font-medium underline">
          View All
        </button>
        <div className="flex gap-1.5">
          <button 
            className="w-8 h-8 bg-white rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            title="Previous"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="w-8 h-8 bg-white rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            title="Next"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </ChartCard>
  );
}

export function Charts() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
      <div className="space-y-8">
        {/* Top Row - Revenue and Visitors Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <VisitorsTrendsChart />
          </div>
        </div>

        {/* Bottom Row - Most Sold Items and Products Added */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MostSoldItemsChart />
          <ProductsAddedGrid />
        </div>
      </div>
    </div>
  );
}
