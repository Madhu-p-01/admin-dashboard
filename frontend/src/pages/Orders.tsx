import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  Plus,
  Bell,
  ChevronDown,
  Copy,
  Pencil,
  MoreVertical,
  Trash2,
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent } from "../components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import { Badge } from "../components/ui/Badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { useOrders } from '../hooks/useOrders';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState(["Last 7 days", "New Customers", "Extract Details"])
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showCustomDateForm, setShowCustomDateForm] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedQuickOption, setSelectedQuickOption] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  const { orders, stats, loading, error, deleteOrder, exportOrders } = useOrders();

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = async () => {
    try {
      await exportOrders();
      console.log('Orders exported successfully');
    } catch (err) {
      console.error('Error exporting orders:', err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      console.log('Order deleted successfully');
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Orders">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading orders...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Orders">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-destructive">Error loading orders: {error}</div>
        </div>
      </AdminLayout>
    );
  }

  const handleAddOrder = () => {
    navigate('/orders/add');
  };

  return (
    <AdminLayout title="Orders">
      <div>
        {/* Main Content Box with Curved Borders */}
        <Card className="rounded-lg border">
          <CardContent className="p-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Search and Filters */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 gap-2 sm:gap-3">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
              placeholder="Search..."
                    className="pl-8 sm:pl-9 bg-muted/50 border-border text-sm sm:text-base h-8 sm:h-10"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                        <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 rounded-lg border shadow-lg -ml-48 overflow-visible">
                      <DropdownMenuItem className="flex items-center justify-between py-3 px-4">
                        Order Status
                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                      </DropdownMenuItem>
                      <div className="relative overflow-visible">
                        <div 
                          className={`flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-50 ${selectedFilter === 'payment' ? 'text-blue-600 bg-blue-50' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedFilter(selectedFilter === 'payment' ? null : 'payment');
                          }}
                        >
                          Payment Status
                          <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                        </div>
                        {selectedFilter === 'payment' && (
                          <div className="absolute left-full top-0 ml-1 w-32 bg-white rounded-lg border shadow-lg z-[100] overflow-visible">
                            <div className="py-1">
                              <div className="px-4 py-1 hover:bg-gray-50 cursor-pointer">Paid</div>
                              <div className="px-4 py-1 hover:bg-gray-50 cursor-pointer">Unpaid</div>
                              <div className="px-4 py-1 hover:bg-gray-50 cursor-pointer">Partially Paid</div>
                              <div className="px-4 py-1 hover:bg-gray-50 cursor-pointer">Refunded</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="relative overflow-visible">
                        <div 
                          className={`flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-50 ${selectedFilter === 'date' ? 'text-blue-600 bg-blue-50' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedFilter(selectedFilter === 'date' ? null : 'date');
                          }}
                        >
                          Date Range
                          <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                        </div>
                        {selectedFilter === 'date' && (
                          <div className="absolute left-full top-0 ml-1 w-32 bg-white rounded-lg border shadow-lg z-[100] overflow-visible">
                            <div className="py-1">
                              <div className="px-4 py-1 hover:bg-gray-50 cursor-pointer">Today</div>
                              <div className="px-4 py-1 hover:bg-gray-50 cursor-pointer">Last 7 Days</div>
                              <div className="px-4 py-1 hover:bg-gray-50 cursor-pointer">Last 30 Days</div>
                              <div 
                                className="px-4 py-1 hover:bg-gray-50 cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setShowCustomDateForm(!showCustomDateForm);
                                }}
                              >
                                Custom Range
                              </div>
                            </div>
                          </div>
                        )}
                        {showCustomDateForm && (
                          <div className="absolute left-0 top-full mt-16 w-96 bg-white rounded-lg border shadow-lg z-[100] overflow-visible p-4">
                            <h3 className="text-sm font-semibold mb-4">Custom Date Range</h3>
                            
                            {/* Date Input Fields */}
                            <div className="flex items-center space-x-6 mb-6">
                              <div className="flex items-center space-x-2">
                                <label className="text-xs font-medium">From:</label>
                                <div className="relative">
                                  <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-32 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 [&::-webkit-datetime-edit-text]:invisible [&::-webkit-datetime-edit-month-field]:invisible [&::-webkit-datetime-edit-day-field]:invisible [&::-webkit-datetime-edit-year-field]:invisible"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <label className="text-xs font-medium">To:</label>
                                <div className="relative">
                                  <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-32 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 [&::-webkit-datetime-edit-text]:invisible [&::-webkit-datetime-edit-month-field]:invisible [&::-webkit-datetime-edit-day-field]:invisible [&::-webkit-datetime-edit-year-field]:invisible"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Quick Options */}
                            <div className="mb-6">
                              <label className="text-xs font-medium mb-3 block">Quick Options:</label>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSelectedQuickOption('today')}
                                  className={`px-2 py-1 text-xs rounded border ${
                                    selectedQuickOption === 'today' 
                                      ? 'bg-blue-100 border-blue-300 text-blue-700' 
                                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  Today
                                </button>
                                <button
                                  onClick={() => setSelectedQuickOption('yesterday')}
                                  className={`px-2 py-1 text-xs rounded border ${
                                    selectedQuickOption === 'yesterday' 
                                      ? 'bg-blue-100 border-blue-300 text-blue-700' 
                                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  Yesterday
                                </button>
                                <button
                                  onClick={() => setSelectedQuickOption('last30')}
                                  className={`px-2 py-1 text-xs rounded border ${
                                    selectedQuickOption === 'last30' 
                                      ? 'bg-blue-100 border-blue-300 text-blue-700' 
                                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  Last 30 days
                                </button>
                                <button
                                  onClick={() => setSelectedQuickOption('lastMonth')}
                                  className={`px-2 py-1 text-xs rounded border ${
                                    selectedQuickOption === 'lastMonth' 
                                      ? 'bg-blue-100 border-blue-300 text-blue-700' 
                                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  Last Month
              </button>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => setShowCustomDateForm(false)}
                                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                              >
                                Cancel
              </button>
                              <button
                                onClick={() => {
                                  console.log('Apply custom date range:', { fromDate, toDate, selectedQuickOption });
                                  setShowCustomDateForm(false);
                                }}
                                className="px-3 py-1 text-xs font-medium text-white bg-black rounded hover:bg-gray-800"
                              >
                                Apply
              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="relative overflow-visible">
                        <div 
                          className={`flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-50 ${selectedFilter === 'customer' ? 'text-blue-600 bg-blue-50' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedFilter(selectedFilter === 'customer' ? null : 'customer');
                          }}
                        >
                          Customer Type
                          <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                        </div>
                        {selectedFilter === 'customer' && (
                          <div className="absolute left-full top-0 ml-1 w-40 bg-white rounded-lg border shadow-lg z-[100] overflow-visible">
                            <div className="py-1">
                              <div className="px-3 py-1 hover:bg-gray-50 cursor-pointer text-sm whitespace-nowrap">New Customers</div>
                              <div className="px-3 py-1 hover:bg-gray-50 cursor-pointer text-sm whitespace-nowrap">Returning Customers</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                        <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 rounded-lg border shadow-lg">
                      <DropdownMenuItem 
                        className={`px-4 py-2 text-sm ${selectedSort === 'newest' ? 'text-blue-600' : ''}`}
                        onClick={() => setSelectedSort('newest')}
                      >
                        Newest Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={`px-4 py-2 text-sm ${selectedSort === 'oldest' ? 'text-blue-600' : ''}`}
                        onClick={() => setSelectedSort('oldest')}
                      >
                        Oldest Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={`px-4 py-2 text-sm ${selectedSort === 'highest' ? 'text-blue-600' : ''}`}
                        onClick={() => setSelectedSort('highest')}
                      >
                        Highest Value
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={`px-4 py-2 text-sm ${selectedSort === 'lowest' ? 'text-blue-600' : ''}`}
                        onClick={() => setSelectedSort('lowest')}
                      >
                        Lowest Value
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={`px-4 py-2 text-sm ${selectedSort === 'earliest' ? 'text-blue-600' : ''}`}
                        onClick={() => setSelectedSort('earliest')}
                      >
                        Earliest Delivery
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={`px-4 py-2 text-sm ${selectedSort === 'latest' ? 'text-blue-600' : ''}`}
                        onClick={() => setSelectedSort('latest')}
                      >
                        Latest Delivery
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={`px-4 py-2 text-sm ${selectedSort === 'customer-az' ? 'text-blue-600' : ''}`}
                        onClick={() => setSelectedSort('customer-az')}
                      >
                        Customer A-Z
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={`px-4 py-2 text-sm ${selectedSort === 'customer-za' ? 'text-blue-600' : ''}`}
                        onClick={() => setSelectedSort('customer-za')}
                      >
                        Customer Z-A
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" className="gap-1 sm:gap-2 bg-transparent h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3" onClick={handleExport}>
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Export</span>
                  </Button>
                  <Button variant="outline" className="gap-1 sm:gap-2 bg-transparent h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3" onClick={handleAddOrder}>
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Add Order</span>
                  </Button>
            </div>
          </div>
          
          {/* Active Filters */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                {activeFilters.map((filter) => (
                  <Badge key={filter} variant="secondary" className="gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-normal">
                    <span className="truncate max-w-[120px] sm:max-w-none">{filter}</span>
                    <button onClick={() => removeFilter(filter)} className="hover:text-foreground flex-shrink-0">
                      ×
                    </button>
                  </Badge>
            ))}
          </div>
        </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl lg:text-4xl font-bold text-foreground">{stats.totalOrders}</div>
                    <div className="mt-1 text-xs sm:text-sm text-muted-foreground">Total Orders</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl lg:text-4xl font-bold text-foreground">{stats.totalDelivered}</div>
                    <div className="mt-1 text-xs sm:text-sm text-muted-foreground">Total Delivered</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl lg:text-4xl font-bold text-foreground">{stats.pendingOrders}</div>
                    <div className="mt-1 text-xs sm:text-sm text-muted-foreground">Pending Orders</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl lg:text-4xl font-bold text-foreground">{stats.ordersHold}</div>
                    <div className="mt-1 text-xs sm:text-sm text-muted-foreground">Orders Hold</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table - Mobile Card View */}
            <div className="block sm:hidden">
              <div className="space-y-2">
                {filteredOrders.map((order, index) => (
                  <Card key={index} className={`${index % 2 === 0 ? 'bg-background' : 'bg-[#F4F4F4]'}`}>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{order.orderNumber}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="group h-6 px-2 py-1 bg-green-100 text-green-800 hover:bg-green-200 text-xs font-normal rounded-full border-0 data-[state=open]:bg-green-200"
                            >
                              {order.status}
                              <ChevronDown className="h-2 w-2 ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-40">
                            <DropdownMenuItem>Processing</DropdownMenuItem>
                            <DropdownMenuItem>Scheduled</DropdownMenuItem>
                            <DropdownMenuItem>Refunded</DropdownMenuItem>
                            <DropdownMenuItem>Shipped</DropdownMenuItem>
                            <DropdownMenuItem>Delivered</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarImage src={order.productImage || "/placeholder.svg?height=24&width=24"} />
                          <AvatarFallback className="text-xs">P</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{order.products} Items</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground">{order.customer.name}</span>
                        <span className="font-medium">{order.total}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{order.date}</span>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-6 w-6">
                            <Pencil className="h-3 w-3 text-muted-foreground" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <MoreVertical className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
        </div>

            {/* Orders Table - Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-[#F4F4F4] border-b border-border">
                    <th className="px-2 sm:px-4 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-foreground rounded-tl-lg">Order ID</th>
                    <th className="px-2 sm:px-4 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-foreground">Products</th>
                    <th className="px-2 sm:px-4 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-foreground">
                      <div className="flex items-center gap-1">
                        Date
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-foreground">
                      <div className="flex items-center gap-1">
                        Customer
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-foreground">Total</th>
                    <th className="px-2 sm:px-4 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-foreground">
                      <div className="flex items-center gap-1">
                        Status
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-foreground rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-border last:border-0 ${
                        index % 2 === 0 ? 'bg-background' : 'bg-[#F4F4F4]'
                      } hover:bg-muted/40`}
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground font-medium">{order.orderNumber}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border border-border">
                            <AvatarImage src={order.productImage || "/placeholder.svg?height=32&width=32"} />
                            <AvatarFallback className="text-xs">P</AvatarFallback>
                          </Avatar>
                          <span className="text-xs sm:text-sm text-muted-foreground">{order.products} Items</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground">{order.date}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground">{order.customer.name}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground font-medium">{order.total}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="group h-6 sm:h-7 px-2 sm:px-3 py-1 bg-green-100 text-green-800 hover:bg-green-200 text-xs sm:text-sm font-normal rounded-full border-0 data-[state=open]:bg-green-200"
                            >
                              {order.status}
                              <ChevronDown className="h-2 w-2 sm:h-3 sm:w-3 ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-40">
                            <DropdownMenuItem>Processing</DropdownMenuItem>
                            <DropdownMenuItem>Scheduled</DropdownMenuItem>
                            <DropdownMenuItem>Refunded</DropdownMenuItem>
                            <DropdownMenuItem>Shipped</DropdownMenuItem>
                            <DropdownMenuItem>Delivered</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-muted/50"
                          >
                            <Pencil className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-muted/50"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-muted/50"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
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
  )
}