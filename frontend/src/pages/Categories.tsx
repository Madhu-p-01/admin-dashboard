import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/DropdownMenu';
import { 
  Search,
  SlidersHorizontal,
  Download,
  Plus
} from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Mock category data
  const categories = [
    { id: 1, name: 'Category 1', image: null },
    { id: 2, name: 'Category 2', image: null },
    { id: 3, name: 'Category 3', image: null },
    { id: 4, name: 'Category 4', image: null },
    { id: 5, name: 'Category 5', image: null },
    { id: 6, name: 'Category 6', image: null },
    { id: 7, name: 'Category 7', image: null },
    { id: 8, name: 'Category 8', image: null },
    { id: 9, name: 'Category 9', image: null },
    { id: 10, name: 'Category 10', image: null },
    { id: 11, name: 'Category 11', image: null },
    { id: 12, name: 'Category 12', image: null },
  ];

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddCategory = () => {
    navigate('/categories/add');
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/categories/${categoryId}`);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };


  return (
    <AdminLayout title="Categories">
      <div className="p-6">
        <Card className="rounded-lg border">
          <CardContent className="p-6">
            {/* Top Bar */}
            <div className="flex items-center gap-2 mb-6">
              {/* Search Bar - Full Width */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>

              {/* Action Buttons - 3 Square Icon Buttons */}
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
                      All Categories
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterSelect('active')}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterSelect('inactive')}>
                      Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterSelect('featured')}>
                      Featured
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Download Button */}
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Download className="h-4 w-4" />
                </Button>

                {/* Add Button */}
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={handleAddCategory}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCategories.map((category) => (
                <Card 
                  key={category.id} 
                  className="rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-0">
                    {/* Image Placeholder */}
                    <div className="h-32 bg-gray-100 rounded-t-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
                        {/* Abstract shapes */}
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-white opacity-30 rounded-t-full"></div>
                        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white rounded-full opacity-40"></div>
                        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-white rounded-full opacity-50"></div>
                      </div>
                    </div>
                    
                    {/* Category Name */}
                    <div className="p-4 text-center">
                      <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Categories;
