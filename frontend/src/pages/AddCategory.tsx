import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
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
  Upload
} from 'lucide-react';

const AddCategory = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  const handleSaveDraft = () => {
    console.log('Save draft:', { categoryName, description, categoryImage });
  };

  const handlePublish = () => {
    console.log('Publish category:', { categoryName, description, categoryImage });
    // Navigate back to categories page after successful creation
    navigate('/categories');
  };

  const handleCancel = () => {
    navigate('/categories');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCategoryImage(file);
    }
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setCategoryImage(file);
    }
  };

  const handleImageDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <AdminLayout title="Add Category">
      <div className="p-6">
        <Card className="rounded-lg border">
          <CardContent className="p-6">
            {/* Name & Description Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Name & description</h2>
              
              {/* Category Name */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Category Name</label>
                  <Info className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Maximum 100 characters. No HTML or emoji allowed
                  </span>
                </div>
                <Input
                  placeholder="Input your text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  maxLength={100}
                  className="bg-gray-50 border-gray-300"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {categoryName.length}/100 characters
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 p-4 bg-[#E0E0E0] border-0 resize-none focus:outline-none focus:ring-0 rounded-b-lg"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            {/* Images & CTA Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Images & CTA</h2>
              
              {/* Category Image Upload */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Category Image Upload</label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
                  onDrop={handleImageDrop}
                  onDragOver={handleImageDragOver}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {categoryImage ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <img 
                          src={URL.createObjectURL(categoryImage)} 
                          alt="Category preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-sm text-gray-600">{categoryImage.name}</p>
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSaveDraft}
                className="px-6"
              >
                Save Draft
              </Button>
              <Button 
                onClick={handlePublish}
                className="px-6 bg-black text-white hover:bg-gray-800"
              >
                Publish Category
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AddCategory;
