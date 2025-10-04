import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Download,
  Upload,
  Plus,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  image?: string;
  sku: string;
  availability: number;
}

const Inventory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Product Name',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0001',
      availability: 10
    },
    {
      id: '2',
      name: 'Product Name',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0001',
      availability: 10
    },
    {
      id: '3',
      name: 'Product Name',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0001',
      availability: 10
    },
    {
      id: '4',
      name: 'Product Name',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0001',
      availability: 10
    },
    {
      id: '5',
      name: 'Product Name',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0001',
      availability: 10
    },
    {
      id: '6',
      name: 'Product Name',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      sku: 'OEL0001',
      availability: 10
    }
  ]);

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

  const handleImport = () => {
    console.log('Import inventory');
  };

  const handleExport = () => {
    console.log('Export inventory');
  };

  const handleAddInventory = () => {
    navigate('/products/inventory/new');
  };

  const handleAvailabilityChange = (productId: string, newValue: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, availability: Math.max(0, newValue) }
          : product
      )
    );
  };

  const handleSave = (productId: string) => {
    console.log('Save inventory for product:', productId);
    // Here you would typically make an API call to save the inventory
  };

  return (
    <AdminLayout title="Inventory">
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

                {/* Import Button */}
                <Button variant="outline" onClick={handleImport} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import
                </Button>

                {/* Export Button */}
                <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>

                {/* New Inventory Button */}
                <Button onClick={handleAddInventory} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Inventory
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
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={product.availability}
                            onChange={(e) => handleAvailabilityChange(product.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                          />
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-gray-200"
                              onClick={() => handleAvailabilityChange(product.id, product.availability + 1)}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-gray-200"
                              onClick={() => handleAvailabilityChange(product.id, product.availability - 1)}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          onClick={() => handleSave(product.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium"
                        >
                          SAVE
                        </Button>
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

export default Inventory;
