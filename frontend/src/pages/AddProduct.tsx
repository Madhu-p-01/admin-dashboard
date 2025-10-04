import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { 
  Info,
  Upload,
  Plus,
  X,
  ShoppingCart,
  ChevronDown,
  Check,
  Save,
  Eye,
  Bold,
  Italic,
  Underline,
  Link,
  Smile,
  List,
  AlignCenter,
  Undo2,
  Redo2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Color {
  id: string;
  name: string;
  value: string;
}

interface Size {
  id: string;
  name: string;
  selected: boolean;
}

export default function AddProductPage() {
  const [productTitle, setProductTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keyFeatures, setKeyFeatures] = useState(['', '', '', '']);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);
  const [category, setCategory] = useState('');
  const [sizes, setSizes] = useState<Size[]>([
    { id: 'xs', name: 'XS', selected: true },
    { id: 's', name: 'S', selected: false },
    { id: 'm', name: 'M', selected: false },
    { id: 'l', name: 'L', selected: false },
    { id: 'xl', name: 'XL', selected: true },
    { id: 'xxl', name: 'XXL', selected: false }
  ]);
  const [colors, setColors] = useState<Color[]>([
    { id: '1', name: 'Green', value: '#10b981' },
    { id: '2', name: 'Blue', value: '#3b82f6' }
  ]);
  const [originalAmount, setOriginalAmount] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  const handleSizeToggle = (sizeId: string) => {
    setSizes(prev => prev.map(size => 
      size.id === sizeId ? { ...size, selected: !size.selected } : size
    ));
  };

  const addSize = () => {
    const newSize = { id: `custom-${Date.now()}`, name: 'Custom', selected: false };
    setSizes(prev => [...prev, newSize]);
  };

  const addColor = () => {
    const newColor = { 
      id: `color-${Date.now()}`, 
      name: 'New Color', 
      value: '#6b7280' 
    };
    setColors(prev => [...prev, newColor]);
  };

  const removeColor = (colorId: string) => {
    setColors(prev => prev.filter(color => color.id !== colorId));
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleSubImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSubImages(prev => [...prev, ...files]);
  };

  const calculateDiscountedAmount = () => {
    const amount = parseFloat(originalAmount) || 0;
    const discount = (amount * discountPercentage) / 100;
    const discounted = amount - discount;
    setDiscountedAmount(discounted);
  };

  React.useEffect(() => {
    calculateDiscountedAmount();
  }, [originalAmount, discountPercentage]);

  const handleSaveDraft = () => {
    console.log('Saving draft...');
  };

  const handlePublish = () => {
    console.log('Publishing product...');
  };

  return (
    <AdminLayout title="Add Product">
      <div className="p-6">
        <Card className="rounded-lg border">
          <CardContent className="p-6">
            {/* Name & Description Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Name & description</h2>
              
              {/* Product Title */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Product title</label>
                  <Info className="h-4 w-4 text-gray-400" />
                  <Badge variant="secondary" className="text-xs">Maximum 100 characters. No HTML or emoji allowed.</Badge>
                </div>
                <Input
                  placeholder="Input your text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="w-full"
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <div className="border border-gray-200 rounded-lg bg-gray-50">
                  {/* Rich Text Toolbar */}
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white rounded-t-lg">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Underline className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Link className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <List className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Undo2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Redo2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <textarea
                    placeholder="Enter product description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 p-3 border-0 resize-none focus:outline-none bg-[#E0E0E0] rounded-b-lg placeholder-[#8A8A8A]"
                    rows={6}
                  />
                </div>
              </div>
            </div>

            {/* Key Features Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Key features</h2>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {keyFeatures.map((feature, index) => (
                  <Input
                    key={index}
                    placeholder="Value"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...keyFeatures];
                      newFeatures[index] = e.target.value;
                      setKeyFeatures(newFeatures);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Images & CTA Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Images & CTA</h2>
              
              {/* Cover Images */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Cover images</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-[#E0E0E0] flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    id="cover-image-upload"
                  />
                  <label htmlFor="cover-image-upload" className="cursor-pointer">
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <Upload className="h-4 w-4" />
                      Click or drop image
                    </Button>
                  </label>
                  {coverImage && (
                    <p className="text-sm text-gray-600 mt-2">{coverImage.name}</p>
                  )}
                </div>
              </div>

              {/* Sub Images */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Sub Images</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex gap-4">
                  {subImages.map((image, index) => (
                    <div key={index} className="w-24 h-24 border border-gray-200 rounded-lg flex items-center justify-center bg-[#E0E0E0]">
                      <span className="text-xs text-gray-500">{image.name}</span>
                    </div>
                  ))}
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-[#E0E0E0]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSubImageUpload}
                      className="hidden"
                      id="sub-image-upload"
                    />
                    <label htmlFor="sub-image-upload" className="cursor-pointer">
                      <Plus className="h-6 w-6 text-gray-400" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <div className="relative">
                  <ShoppingCart className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Select category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Sizes Available */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Sizes Available</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size.id}
                      variant={size.selected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSizeToggle(size.id)}
                      className={size.selected ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {size.name}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={addSize}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Colors Available */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Colors Available</h3>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {colors.map((color) => (
                    <div key={color.id} className="flex items-center gap-3">
                      {/* Color Input */}
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 min-w-[120px]">
                        <span className="text-sm text-gray-700">{color.name}</span>
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.value }}
                        />
                      </div>
                      
                      {/* Product Button */}
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Product
                      </Button>
                      
                      {/* Remove Button */}
                      <Button variant="ghost" size="sm" onClick={() => removeColor(color.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Add New Color Row */}
                  <div className="flex items-center gap-3">
                    {/* Add Color Input */}
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 min-w-[120px] cursor-pointer hover:bg-gray-100" onClick={addColor}>
                      <span className="text-sm text-gray-700">Color</span>
                      <Plus className="h-4 w-4 text-gray-500" />
                    </div>
                    
                    {/* Product Button */}
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Product
                    </Button>
                    
                    {/* Remove Button */}
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Price</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Original Amount */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">Original amount</label>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="relative">
                      <div className="absolute left-0 top-0 h-10 w-8 bg-gray-100 border-r border-gray-300 rounded-l-md flex items-center justify-center cursor-pointer hover:bg-gray-200">
                        <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                          <SelectTrigger className="h-full w-full border-0 bg-transparent focus:ring-0 focus:ring-offset-0 p-0 flex items-center justify-center">
                            <SelectValue className="text-gray-700 font-medium">
                              {selectedCurrency === 'INR' && '₹'}
                              {selectedCurrency === 'USD' && '$'}
                              {selectedCurrency === 'EUR' && '€'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">₹ INR</SelectItem>
                            <SelectItem value="USD">$ USD</SelectItem>
                            <SelectItem value="EUR">€ EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        type="number"
                        value={originalAmount}
                        onChange={(e) => setOriginalAmount(e.target.value)}
                        className="pl-12 rounded-l-none border-l-0"
                      />
                    </div>
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">Discount Percentage</label>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="relative">
                      <div className="absolute left-0 top-0 h-10 w-12 bg-gray-100 border border-gray-300 rounded-l-md flex items-center justify-center">
                        <span className="text-gray-600 font-medium">%</span>
                      </div>
                      <Input
                        type="number"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                        className="pl-12 rounded-l-none"
                      />
                    </div>
                  </div>

                  {/* Discounted Amount */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">Discounted amount</label>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="relative">
                      <div className="absolute left-0 top-0 h-10 w-8 bg-gray-100 border-r border-gray-300 rounded-l-md flex items-center justify-center">
                        <span className="text-gray-700 font-medium">
                          {selectedCurrency === 'INR' && '₹'}
                          {selectedCurrency === 'USD' && '$'}
                          {selectedCurrency === 'EUR' && '€'}
                        </span>
                      </div>
                      <Input
                        type="number"
                        value={discountedAmount}
                        readOnly
                        className="pl-12 rounded-l-none border-l-0 bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                <span>Last saved Oct 4, 2021 - 23:32</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handlePublish}>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
