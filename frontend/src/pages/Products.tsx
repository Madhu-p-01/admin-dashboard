import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowUpDown,
  Plus,
  MoreVertical,
  TrendingUp
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  imageUrl?: string;
  summary?: string;
  description?: string;
  sales: number;
  salesTrend: number;
  remaining: number;
  total: number;
  status?: 'active' | 'inactive' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const products: Product[] = [
    {
      id: '1',
      name: 'Off-White Trousers',
      category: 'Bottoms',
      price: 2110.40,
      image: 'https://via.placeholder.com/80x80?text=Product',
      summary: 'Lorem ipsum is placeholder text commonly used in the graphic.',
      sales: 1269,
      salesTrend: 15,
      remaining: 1000,
      total: 2000
    },
    {
      id: '2',
      name: 'Off-White Trousers',
      category: 'Bottoms',
      price: 2110.40,
      image: 'https://via.placeholder.com/80x80?text=Product',
      summary: 'Lorem ipsum is placeholder text commonly used in the graphic.',
      sales: 1269,
      salesTrend: 15,
      remaining: 1000,
      total: 2000
    },
    {
      id: '3',
      name: 'Off-White Trousers',
      category: 'Bottoms',
      price: 2110.40,
      image: 'https://via.placeholder.com/80x80?text=Product',
      summary: 'Lorem ipsum is placeholder text commonly used in the graphic.',
      sales: 1269,
      salesTrend: 15,
      remaining: 1000,
      total: 2000
    },
    {
      id: '4',
      name: 'Off-White Trousers',
      category: 'Bottoms',
      price: 2110.40,
      image: 'https://via.placeholder.com/80x80?text=Product',
      summary: 'Lorem ipsum is placeholder text commonly used in the graphic.',
      sales: 1269,
      salesTrend: 15,
      remaining: 1000,
      total: 2000
    },
    {
      id: '5',
      name: 'Off-White Trousers',
      category: 'Bottoms',
      price: 2110.40,
      image: 'https://via.placeholder.com/80x80?text=Product',
      summary: 'Lorem ipsum is placeholder text commonly used in the graphic.',
      sales: 1269,
      salesTrend: 15,
      remaining: 1000,
      total: 2000
    },
    {
      id: '6',
      name: 'Off-White Trousers',
      category: 'Bottoms',
      price: 2110.40,
      image: 'https://via.placeholder.com/80x80?text=Product',
      summary: 'Lorem ipsum is placeholder text commonly used in the graphic.',
      sales: 1269,
      salesTrend: 15,
      remaining: 1000,
      total: 2000
    }
  ];

  const getSalesProgress = (sales: number, total: number) => {
    if (total === 0) return 0;
    return Math.min((sales / total) * 100, 100);
  };

  const getRemainingProgress = (remaining: number, total: number) => {
    if (total === 0) return 0;
    return Math.min((remaining / total) * 100, 100);
  };

  const getProductImage = (product: Product) => {
    // Handle different image field names from API
    return product.imageUrl || product.image || '';
  };

  const getProductSummary = (product: Product) => {
    // Handle different summary/description field names from API
    return product.summary || product.description || 'No description available';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <AdminLayout title="Products">
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
                <Button 
                  className="h-10 px-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/products/add')}
                >
                  <Plus className="h-4 w-4" />
                  Product
                </Button>
					</div>
				</div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
				</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {/* Product Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-16 w-16 rounded-lg">
                            <AvatarImage 
                              src={getProductImage(product)} 
                              alt={product.name}
                              onError={(e) => {
                                // Handle image loading errors gracefully
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {product.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{product.category}</p>
				</div>
			</div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
		</div>

                      {/* Price */}
                      <div className="mb-3">
                        <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
				</div>

                      {/* Summary */}
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Summary</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{getProductSummary(product)}</p>
		</div>

                      {/* Sales Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">Sales</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-xs font-semibold text-gray-900">{product.sales.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${getSalesProgress(product.sales, product.total)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Remaining Products Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">Remaining Products</span>
                          <span className="text-xs font-semibold text-gray-900">{product.remaining.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${getRemainingProgress(product.remaining, product.total)}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
			</div>
    </AdminLayout>
  );
}