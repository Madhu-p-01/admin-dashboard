import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { SearchBar } from '../components/ui/SearchBar';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ui/ProductCard';
import { OrderItem } from '../components/ui/OrderItem';
import { Input } from '../components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import { Icon } from '../components/ui/Icon';

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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0;
  const shipping = 39;
  const tax = 9;
  const total = subtotal - discount + shipping + tax;

  return (
    <AdminLayout title="Add Orders">
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
          {/* Left Column - Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
                
                {/* Search and Scan */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Search Product"
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Icon name="maximize" size={16} />
                    Scan Barcode
                  </Button>
                </div>

                {/* Table Headers */}
                <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                  <div className="col-span-5">Products</div>
                  <div className="col-span-2">Availability</div>
                  <div className="col-span-2">Action</div>
                  <div className="col-span-3">
                    <div className="flex items-center justify-between">
                      <span>All</span>
                      <div className="flex gap-2">
                        <span>Customer</span>
                        <span>Product Title</span>
                        <span>Product ID</span>
                        <span>SKU</span>
                        <span>Variant ID</span>
                        <span>Variant Name</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product List */}
              <div className="p-6 space-y-3">
                {mockProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onAdd={addToCart}
                    isAdded={cartItems.some(item => item.id === product.id)}
                  />
                ))}
              </div>
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

            {/* Payment Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
              
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

              {/* Payment Status */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment</label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Unpaid">Unpaid</SelectItem>
                      <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentStatus === 'Partially Paid' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partial Amount Paid</label>
                    <Input
                      type="number"
                      value={partialAmount}
                      onChange={(e) => setPartialAmount(e.target.value)}
                      placeholder="₹"
                      leftIcon={<span className="text-gray-500">₹</span>}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon name="bell" size={16} />
                  <span>Set Reminder</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customer Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer</h3>
              
              <div className="space-y-4">
                <Input
                  placeholder="Search Customer"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  leftIcon={<Icon name="search" size={16} className="text-gray-400" />}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm">
                      <Icon name="edit" size={16} />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm">
                      <Icon name="edit" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline">Send Invoice</Button>
          <Button>Add Order</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
