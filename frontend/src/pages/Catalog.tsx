import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Info,
  Bold,
  Italic,
  Underline,
  AtSign,
  Link,
  Image as ImageIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
  Upload,
  Plus
} from 'lucide-react';

const Catalog = () => {
  const navigate = useNavigate();
  const [heroImages, setHeroImages] = useState<File[]>([]);
  const [heroMessage, setHeroMessage] = useState('');
  const [showcaseImage1, setShowcaseImage1] = useState<File | null>(null);
  const [showcaseImage2, setShowcaseImage2] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      setter(file);
    }
  };

  const handleHeroImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHeroImages([...heroImages, file]);
    }
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>, setter: (file: File | null) => void) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setter(file);
    }
  };

  const handleHeroImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setHeroImages([...heroImages, file]);
    }
  };

  const handleImageDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleAddImageSlider = () => {
    // Add new image slider slot
    console.log('Add new image slider');
  };

  const handleSaveDraft = () => {
    console.log('Save draft:', {
      heroImages,
      heroMessage,
      showcaseImage1,
      showcaseImage2
    });
  };

  const handlePublish = () => {
    console.log('Publish catalog:', {
      heroImages,
      heroMessage,
      showcaseImage1,
      showcaseImage2
    });
  };

  const handleCancel = () => {
    navigate('/catalog');
  };

  return (
    <AdminLayout title="Catalog">
      <div>
        <Card className="rounded-lg border">
          <CardContent className="p-6">
            {/* Hero Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Hero Section</h2>
              
              {/* Hero Section Image */}
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-900 mb-4">Hero Section Image</h3>
                
                {/* Image Slider 1 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">Image Slider 1</label>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
                    onDrop={handleHeroImageDrop}
                    onDragOver={handleImageDragOver}
                    onClick={() => document.getElementById('hero-image-1')?.click()}
                  >
                    <input
                      id="hero-image-1"
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center h-32">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Click or drop image
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Image Slider 2 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">Image Slider 2</label>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
                    onDrop={handleHeroImageDrop}
                    onDragOver={handleImageDragOver}
                    onClick={() => document.getElementById('hero-image-2')?.click()}
                  >
                    <input
                      id="hero-image-2"
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center h-32">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Click or drop image
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Image Slider 3 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">Image Slider 3</label>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
                    onDrop={handleHeroImageDrop}
                    onDragOver={handleImageDragOver}
                    onClick={() => document.getElementById('hero-image-3')?.click()}
                  >
                    <input
                      id="hero-image-3"
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center h-32">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Click or drop image
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Add Image Slider Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddImageSlider}
                    className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Image Slider
                  </Button>
                </div>
              </div>

              {/* Hero Section Top Message */}
              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-900 mb-4">Hero Section Top Message</h3>
                
                <div className="mb-4">
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
                          <Link className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <List className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <AlignRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <AlignJustify className="h-4 w-4" />
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
                      value={heroMessage}
                      onChange={(e) => setHeroMessage(e.target.value)}
                      className="w-full h-32 p-4 bg-[#E0E0E0] border-0 resize-none focus:outline-none focus:ring-0 rounded-b-lg"
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Showcase Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Showcase Section</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image 1 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">Image 1</label>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
                    onDrop={(e) => handleImageDrop(e, setShowcaseImage1)}
                    onDragOver={handleImageDragOver}
                    onClick={() => document.getElementById('showcase-image-1')?.click()}
                  >
                    <input
                      id="showcase-image-1"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setShowcaseImage1)}
                      className="hidden"
                    />
                    {showcaseImage1 ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <img 
                            src={URL.createObjectURL(showcaseImage1)} 
                            alt="Showcase preview" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-sm text-gray-600">{showcaseImage1.name}</p>
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

                {/* Image 2 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">Image 2</label>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
                    onDrop={(e) => handleImageDrop(e, setShowcaseImage2)}
                    onDragOver={handleImageDragOver}
                    onClick={() => document.getElementById('showcase-image-2')?.click()}
                  >
                    <input
                      id="showcase-image-2"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setShowcaseImage2)}
                      className="hidden"
                    />
                    {showcaseImage2 ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <img 
                            src={URL.createObjectURL(showcaseImage2)} 
                            alt="Showcase preview" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-sm text-gray-600">{showcaseImage2.name}</p>
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
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Catalog;