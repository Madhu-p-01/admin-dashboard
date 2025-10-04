import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/DropdownMenu';
import { 
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Plus,
  Pencil,
  Trash2,
  MoreVertical
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  image?: string;
  sku: string;
  availability: number;
  price: number;
  category: string;
}

const CategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  // Mock data - in real implementation, this would come from API
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product Name 1',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0001',
      availability: 1000,
      price: 1800,
      category: 'Category 1'
    },
    {
      id: '2',
      name: 'Product Name 2',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0002',
      availability: 500,
      price: 2200,
      category: 'Category 1'
    },
    {
      id: '3',
      name: 'Product Name 3',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0003',
      availability: 750,
      price: 1500,
      category: 'Category 1'
    },
    {
      id: '4',
      name: 'Product Name 4',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0004',
      availability: 300,
      price: 2500,
      category: 'Category 1'
    },
    {
      id: '5',
      name: 'Product Name 5',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0005',
      availability: 1200,
      price: 1900,
      category: 'Category 1'
    },
    {
      id: '6',
      name: 'Product Name 6',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0006',
      availability: 800,
      price: 2100,
      category: 'Category 1'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        // In real implementation, fetch from API: `/api/v1/admin/categories/${categoryId}/products`
        // const response = await apiClient.get(`/categories/${categoryId}/products`);
        // setProducts(response.data);
        
        // Mock data for now
        setTimeout(() => {
          setProducts(mockProducts);
          setCategoryName(`Category ${categoryId}`);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching category products:', error);
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryProducts();
    }
  }, [categoryId]);

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleAddProduct = () => {
    console.log('Add new product to category');
  };

  const handleEditProduct = (productId: string) => {
    console.log('Edit product:', productId);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log('Delete product:', productId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <AdminLayout title="Loading...">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading products...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`${categoryName} Products`}>
      <div className="p-6">
        <Card className="rounded-lg border">
          <CardContent className="p-6">
            {/* Top Bar */}
            <div className="flex items-center gap-2 mb-6">
              {/* Search Bar - Full Width */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Filter Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleFilterSelect('all')}>
                      All Products
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterSelect('in-stock')}>
                      In Stock
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterSelect('out-of-stock')}>
                      Out of Stock
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterSelect('low-stock')}>
                      Low Stock
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Button */}
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>

                {/* Add Product Button */}
                <Button onClick={handleAddProduct} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Category
                </Button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F4F4F4]">
                  <tr>
                    <th className="px-4 py-5 text-left font-semibold text-gray-900 rounded-tl-lg">
                      Products
                    </th>
                    <th className="px-4 py-5 text-left font-semibold text-gray-900">
                      SKU
                    </th>
                    <th className="px-4 py-5 text-left font-semibold text-gray-900">
                      Availability
                    </th>
                    <th className="px-4 py-5 text-left font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-4 py-5 text-left font-semibold text-gray-900 rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr 
                      key={product.id}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#F4F4F4]'
                      } hover:bg-muted/40 border-b border-gray-100`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-border">
                            <AvatarImage 
                              src={product.image} 
                              alt={product.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <AvatarFallback className="text-xs">
                              {product.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">
                          {product.sku}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">
                          {product.availability}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted/50"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted/50"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted/50"
                          >
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
};

export default CategoryDetail;

