import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { 
  Search, 
  Download, 
  SlidersHorizontal, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart,
  Users,
  Package,
  ArrowUpDown,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronDown
} from 'lucide-react';

interface AbandonedCheckout {
  id: string;
  products: number;
  date: string;
  customer: string;
  total: string;
  stage: string;
  status: string;
  statusColor: string;
}

export default function AbandonedCheckoutPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const abandonedCheckouts: AbandonedCheckout[] = [
    {
      id: '#53200002',
      products: 8,
      date: 'Jan 10, 2025',
      customer: 'Aisha Sharma',
      total: '₹80.76',
      stage: 'Shipping Details',
      status: 'Not Recovered',
      statusColor: 'bg-red-100 text-red-800'
    },
    {
      id: '#53200002',
      products: 8,
      date: 'Jan 10, 2025',
      customer: 'Aisha Sharma',
      total: '₹80.76',
      stage: 'Payment Page',
      status: 'Completed Later',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '#53200002',
      products: 8,
      date: 'Jan 10, 2025',
      customer: 'Aisha Sharma',
      total: '₹80.76',
      stage: 'Shipping Details',
      status: 'Completed Later',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '#53200002',
      products: 8,
      date: 'Jan 10, 2025',
      customer: 'Aisha Sharma',
      total: '₹80.76',
      stage: 'Cart Review',
      status: 'Not Recovered',
      statusColor: 'bg-red-100 text-red-800'
    },
    {
      id: '#53200002',
      products: 8,
      date: 'Jan 10, 2025',
      customer: 'Aisha Sharma',
      total: '₹80.76',
      stage: 'Other',
      status: 'Reminder Sent',
      statusColor: 'bg-gray-100 text-gray-800'
    },
    {
      id: '#53200002',
      products: 8,
      date: 'Jan 10, 2025',
      customer: 'Aisha Sharma',
      total: '₹80.76',
      stage: 'Shipping Details',
      status: 'Reminder Sent',
      statusColor: 'bg-gray-100 text-gray-800'
    },
    {
      id: '#53200002',
      products: 8,
      date: 'Jan 10, 2025',
      customer: 'Aisha Sharma',
      total: '₹80.76',
      stage: 'Cart Review',
      status: 'Completed Later',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '#53200002',
      products: 8,
      date: 'Jan 10, 2025',
      customer: 'Aisha Sharma',
      total: '₹80.76',
      stage: 'Other',
      status: 'Not Recovered',
      statusColor: 'bg-red-100 text-red-800'
    }
  ];

  const summaryCards = [
    {
      percentage: '30%',
      growth: '+0.10%',
      title: 'at Cart Review',
      color: 'bg-blue-50'
    },
    {
      percentage: '40%',
      growth: '+0.10%',
      title: 'at Shipping Details',
      color: 'bg-green-50'
    },
    {
      percentage: '20%',
      growth: '+0.10%',
      title: 'at Payment Step',
      color: 'bg-yellow-50'
    },
    {
      percentage: '10%',
      growth: '+0.10%',
      title: 'Others',
      color: 'bg-purple-50'
    }
  ];

  return (
    <AdminLayout title="Abandoned Checkout">
      <div className="p-6">
        {/* Main Content Box - All components in one outer box */}
        <Card className="rounded-lg border">
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="flex items-center gap-3 mb-6">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-10 px-4 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {summaryCards.map((card, index) => (
                <div key={index} className={`${card.color} rounded-lg p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">{card.growth}</span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">{card.percentage}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{card.title}</div>
                  <button className="text-xs text-gray-500 hover:text-gray-700 underline">
                    View report
                  </button>
                </div>
              ))}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F4F4F4]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider rounded-tl-lg">
                      Checkout ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Products
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Date
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Customer
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Status
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {abandonedCheckouts.map((checkout, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F4F4F4] hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{checkout.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://via.placeholder.com/32x32?text=D" />
                            <AvatarFallback>D</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{checkout.products} Items</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{checkout.date}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{checkout.customer}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{checkout.total}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{checkout.stage}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${checkout.statusColor} text-xs font-normal rounded-full border-0`}>
                          {checkout.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}