import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import { 
  Info,
  Bold,
  Italic,
  Underline,
  AtSign,
  Paperclip,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Upload,
  ChevronDown
} from 'lucide-react';

const NewInventory = () => {
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState('');
  const [category, setCategory] = useState('Tops');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [shortSummary, setShortSummary] = useState('');
  const [status, setStatus] = useState(true);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setCoverImage(file);
    }
  };

  const handleImageDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSaveDraft = () => {
    console.log('Save draft:', {
      productDetails,
      category,
      coverImage,
      price,
      stockQuantity,
      shortSummary,
      status
    });
    // Navigate back to inventory page after saving draft
    navigate('/products/inventory');
  };

  const handlePublish = () => {
    console.log('Publish inventory item:', {
      productDetails,
      category,
      coverImage,
      price,
      stockQuantity,
      shortSummary,
      status
    });
    // Navigate back to inventory page after publishing
    navigate('/products/inventory');
  };

  const handleCancel = () => {
    navigate('/products/inventory');
  };

  return (
    <AdminLayout title="New Inventory">
      <div className="p-6">
        <Card className="rounded-lg border">
          <CardContent className="p-6">
            {/* Name & Description Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Name & description</h2>
              
              {/* Product Details */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Product Details</label>
                  <Info className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Maximum 100 characters. No HTML or emoji allowed
                  </span>
                </div>
                <Input
                  placeholder="Input your text"
                  value={productDetails}
                  onChange={(e) => setProductDetails(e.target.value)}
                  maxLength={100}
                  className="bg-gray-50 border-gray-300"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {productDetails.length}/100 characters
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tops">Tops</SelectItem>
                    <SelectItem value="Bottoms">Bottoms</SelectItem>
                    <SelectItem value="Dresses">Dresses</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload Product Images Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload Product Images</h2>
              
              {/* Cover Images */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Cover images</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
                  onDrop={handleImageDrop}
                  onDragOver={handleImageDragOver}
                  onClick={() => document.getElementById('cover-image-upload')?.click()}
                >
                  <input
                    id="cover-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {coverImage ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <img 
                          src={URL.createObjectURL(coverImage)} 
                          alt="Cover preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-sm text-gray-600">{coverImage.name}</p>
                      <Button variant="outline" size="sm" className="text-xs">
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Click or drop image
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Stock Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing & Stock</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">Price</label>
                    <Info className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Maximum 100 characters. No HTML or emoji allowed
                    </span>
                  </div>
                  <Input
                    placeholder="Input your text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    maxLength={100}
                    className="bg-gray-50 border-gray-300"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {price.length}/100 characters
                  </div>
                </div>

                {/* Stock Quantity */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                    <Info className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Maximum 100 characters. No HTML or emoji allowed
                    </span>
                  </div>
                  <Input
                    placeholder="Input your text"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    maxLength={100}
                    className="bg-gray-50 border-gray-300"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {stockQuantity.length}/100 characters
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Description</h2>
              
              {/* Short Summary */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Short Summary</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                
                {/* Rich Text Editor */}
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="bg-white border-b border-gray-300 p-2 flex items-center justify-between">
                    {/* Left-aligned icons */}
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
                        <AtSign className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <List className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Right-aligned icons */}
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Undo2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Redo2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Text Area */}
                  <textarea
                    value={shortSummary}
                    onChange={(e) => setShortSummary(e.target.value)}
                    className="w-full h-32 p-4 bg-[#E0E0E0] border-0 resize-none focus:outline-none focus:ring-0 rounded-b-lg"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            {/* Visibility & Settings Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Visibility & Settings</h2>
              
              {/* Status */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus(!status)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      status ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        status ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-medium ${status ? 'text-green-600' : 'text-gray-500'}`}>
                    {status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="px-6 bg-white border-gray-300 text-black hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                variant="outline"
                onClick={handleSaveDraft}
                className="px-6 bg-white border-gray-300 text-black hover:bg-gray-50"
              >
                Save Draft
              </Button>
              <Button 
                onClick={handlePublish}
                className="px-6 bg-black text-white hover:bg-gray-800"
              >
                Publish Inventory Item
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default NewInventory;
