import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { SearchBar } from '../components/ui/SearchBar';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ui/ProductCard';
import { OrderItem } from '../components/ui/OrderItem';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/DropdownMenu';
import { Icon } from '../components/ui/Icon';
import { Search, SlidersHorizontal, QrCode, Trash2, ChevronUp, ChevronDown, ChevronDown as ChevronDownIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  availability: number;
}

interface CartItem extends Product {
  quantity: number;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product Name',
    price: 1000,
    image: '/api/placeholder/64/64',
    availability: 10000
  },
  {
    id: '2',
    name: 'Product Name',
    price: 1000,
    image: '/api/placeholder/64/64',
    availability: 10000
  },
  {
    id: '3',
    name: 'Product Name',
    price: 1000,
    image: '/api/placeholder/64/64',
    availability: 10000
  }
];

export function AddOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [partialAmount, setPartialAmount] = useState('');
  const [productQuantities, setProductQuantities] = useState<{[key: string]: number}>({
    '1': 10,
    '2': 10,
    '3': 10
  });
  const [showShippingInput, setShowShippingInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const addToCart = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cartItems.find(item => item.id === productId);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, prev[productId] + delta)
    }));
  };

  const handleFilterOptionClick = (option: string) => {
    console.log('Selected filter:', option);
    setShowFilterMenu(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0;
  const shipping = 39;
  const tax = 9;
  const total = subtotal - discount + shipping + tax;

  return (
    <AdminLayout title="Add Orders">
      <div className="p-2 sm:p-4 lg:p-6">
        {/* Main Content Box with Curved Borders */}
        <Card className="rounded-lg border">
          <CardContent className="p-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Products Title */}
            <h2 className="text-lg font-semibold text-gray-900">Products</h2>
            
            {/* Search Bar with Filter and Scan Buttons */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Product"
                  className="pl-10 w-full h-10"
                />
              </div>
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 flex-shrink-0"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                
                {showFilterMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                    <div className="py-2">
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterOptionClick('All')}
                      >
                        All
                      </div>
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterOptionClick('Product Title')}
                      >
                        Product Title
                      </div>
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterOptionClick('Product ID')}
                      >
                        Product ID
                      </div>
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterOptionClick('SKU')}
                      >
                        SKU
                      </div>
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterOptionClick('Variant ID')}
                      >
                        Variant ID
                      </div>
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterOptionClick('Variant Name')}
                      >
                        Variant Name
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Button variant="outline" className="flex items-center gap-2 h-10">
                <QrCode className="h-4 w-4" />
                Scan Barcode
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
          {/* Left Column - Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F4F4F4]">
                  <tr>
                    <th scope="col" className="px-4 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-lg">
                      Products
                    </th>
                    <th scope="col" className="px-4 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Availability
                    </th>
                    <th scope="col" className="px-4 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-4 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th scope="col" className="px-4 py-5 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-lg">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Product Row 1 */}
                  <tr className="bg-white hover:bg-muted/40">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 border border-border mr-2">
                          <AvatarImage src="https://via.placeholder.com/150/F4F4F4/000000?text=Dress" alt="Product Image" />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Product Name</div>
                          <div className="text-xs text-gray-500">$ 1000</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      10000
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center border border-gray-300 rounded w-20 h-8">
                        <span className="flex-1 text-center text-sm font-medium">{productQuantities['1']}</span>
                        <div className="flex flex-col border-l border-gray-300">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange('1', 1)}
                            className="h-4 w-5 rounded-none border-b border-gray-300 hover:bg-gray-100"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange('1', -1)}
                            className="h-4 w-5 rounded-none hover:bg-gray-100"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      $ {1000 * productQuantities['1']}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  {/* Product Row 2 (Darker) */}
                  <tr className="bg-[#F4F4F4] hover:bg-muted/40">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 border border-border mr-2">
                          <AvatarImage src="https://via.placeholder.com/150/F4F4F4/000000?text=Dress" alt="Product Image" />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Product Name</div>
                          <div className="text-xs text-gray-500">$ 1000</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      10000
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center border border-gray-300 rounded w-20 h-8">
                        <span className="flex-1 text-center text-sm font-medium">{productQuantities['2']}</span>
                        <div className="flex flex-col border-l border-gray-300">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange('2', 1)}
                            className="h-4 w-5 rounded-none border-b border-gray-300 hover:bg-gray-100"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange('2', -1)}
                            className="h-4 w-5 rounded-none hover:bg-gray-100"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      $ {1000 * productQuantities['2']}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  {/* Product Row 3 */}
                  <tr className="bg-white hover:bg-muted/40">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 border border-border mr-2">
                          <AvatarImage src="https://via.placeholder.com/150/F4F4F4/000000?text=Dress" alt="Product Image" />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Product Name</div>
                          <div className="text-xs text-gray-500">$ 1000</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      10000
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center border border-gray-300 rounded w-20 h-8">
                        <span className="flex-1 text-center text-sm font-medium">{productQuantities['3']}</span>
                        <div className="flex flex-col border-l border-gray-300">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange('3', 1)}
                            className="h-4 w-5 rounded-none border-b border-gray-300 hover:bg-gray-100"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange('3', -1)}
                            className="h-4 w-5 rounded-none hover:bg-gray-100"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      $ {1000 * productQuantities['3']}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cart Items */}
            {cartItems.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-12 gap-4 py-3 px-4 mb-4 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                  <div className="col-span-4">Products</div>
                  <div className="col-span-2">Availability</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Total Price</div>
                  <div className="col-span-2">Customer</div>
                </div>
                
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <OrderItem
                      key={item.id}
                      {...item}
                      onQuantityChange={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Payment Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
              
              {/* Payment Summary Box */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium">1 Item</span>
                    <span className="text-sm font-medium">₹{subtotal}.00</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Add Discount</span>
                    <span className="text-sm text-gray-500">--</span>
                    <span className="text-sm font-medium">₹{discount}.00</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Add Shipping or Delivery</span>
                    <span className="text-sm text-gray-500">--</span>
                    <span className="text-sm font-medium">₹{shipping}.00</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Est Tax</span>
                    <span className="text-sm font-medium">₹{tax}.00</span>
                    <span className="text-sm font-medium">₹{tax}.00</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-base font-semibold text-gray-900">₹{total}.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status Box */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {paymentStatus === 'Unpaid' ? 'Payment (Default: Unpaid)' : paymentStatus}
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem onClick={() => setPaymentStatus('Unpaid')}>
                          Unpaid
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPaymentStatus('Paid')}>
                          Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPaymentStatus('Partially Paid')}>
                          Partially Paid
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {paymentStatus === 'Partially Paid' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Partial Amount Paid</label>
                      <div className="flex">
                        <div className="flex items-center border border-gray-300 rounded-l-md px-3 py-2 bg-gray-50">
                          <span className="text-sm text-gray-600">₹</span>
                          <ChevronDownIcon className="h-3 w-3 ml-1 text-gray-400" />
                        </div>
                        <Input
                          type="number"
                          value={partialAmount}
                          onChange={(e) => setPartialAmount(e.target.value)}
                          placeholder=""
                          className="rounded-l-none border-l-0"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                    <Icon name="bell" size={16} />
                    <span>Set Reminder</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <Button variant="outline">Send Invoice</Button>
                <Button>Add Order</Button>
              </div>
            </div>
          </div>

          {/* Right Column - Customer Info */}
          <div className="space-y-4">
            {/* Customer Search Box */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Customer</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search Customer"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="pl-10 h-8"
                />
              </div>
            </div>

            {/* Shipping Address Box */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Shipping Address</h3>
              {showShippingInput ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="flex-1 h-8"
                    placeholder="Enter shipping address"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setShowShippingInput(false)}
                  >
                    <Icon name="edit" size={16} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-sm text-gray-500">
                    {shippingAddress || "No shipping address set"}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setShowShippingInput(true)}
                  >
                    <Icon name="edit" size={16} />
                  </Button>
                </div>
              )}
            </div>

            {/* Note Box */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Note</h3>
              {showNoteInput ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="flex-1 h-8"
                    placeholder="Enter note"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setShowNoteInput(false)}
                  >
                    <Icon name="edit" size={16} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-sm text-gray-500">
                    {note || "No note added"}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setShowNoteInput(true)}
                  >
                    <Icon name="edit" size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
    </AdminLayout>
  );
}
