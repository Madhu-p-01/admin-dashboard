import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { 
  Calendar,
  ChevronDown,
  Printer,
  Save,
  User
} from 'lucide-react';

export function OrderDetail() {
  const [orderStatus, setOrderStatus] = useState('Pending');
  const [note, setNote] = useState('');

  const orderData = {
    id: '#6743',
    status: 'Pending',
    dateRange: 'Feb 16,2025 - Feb 20,2025',
    products: [
      {
        id: 1,
        name: 'Basic Tee',
        variant: 'Black - Size S',
        quantity: 1,
        price: 1230.00,
        image: 'https://via.placeholder.com/60x60?text=Tee'
      }
    ],
    payment: {
      subtotal: 800.40,
      discount: 0.00,
      shipping: 10.00,
      tax: 1.00,
      total: 2111.00
    },
    delivery: {
      address: 'Dharam Colony, Palam Vihar, Gurgaon, Haryana'
    },
    customer: {
      name: 'Shristi Singh',
      email: 'shristi@gmail.com',
      phone: '+91 904 231 1212',
      avatar: 'https://ui-avatars.com/api/?name=Shristi+Singh&background=random'
    },
    invoice: {
      orderId: '#000001',
      billingAddress: '123, MG Road, Bangalore - 560001',
      shippingAddress: 'Same As Billing',
      items: 'Rib-Knit Dress × 1',
      subtotal: 2599.00,
      taxes: 0.00,
      grandTotal: 2599.00
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="Order Detail">
      <div className="p-6">
        <Card className="rounded-lg border">
          <CardContent className="p-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Orders ID: {orderData.id}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{orderData.dateRange}</span>
                  </div>
                </div>
                <Badge className={`${getStatusColor(orderStatus)} text-sm font-medium px-3 py-1`}>
                  {orderStatus}
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  Change Status
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button className="flex items-center gap-2 bg-black hover:bg-gray-800">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Products Section */}
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
                    {orderData.products.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={product.image} />
                          <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.variant}</p>
                          <p className="text-sm text-gray-500 mt-1">Quantity {product.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Payment Section */}
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{orderData.payment.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium">₹{orderData.payment.discount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping Cost</span>
                        <span className="font-medium">₹{orderData.payment.shipping.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">₹{orderData.payment.tax.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">Total</span>
                          <span className="font-bold text-lg">₹{orderData.payment.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Deliver to Section */}
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Deliver to</h3>
                    <p className="text-gray-600">Address: {orderData.delivery.address}</p>
                  </CardContent>
                </Card>

                {/* Note Section */}
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Note:</h3>
                    <Input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Type some notes"
                      className="w-full"
                      multiline
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Customer Section */}
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer</h3>
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={orderData.customer.avatar} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Full Name: {orderData.customer.name}</p>
                        <p className="text-gray-600">Email: {orderData.customer.email}</p>
                        <p className="text-gray-600">Phone: {orderData.customer.phone}</p>
                      </div>
                    </div>
                    <Button className="w-full bg-black hover:bg-gray-800">
                      View profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Invoice Section */}
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-600">Order ID: {orderData.invoice.orderId}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Billing Address: {orderData.invoice.billingAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Shipping Address: {orderData.invoice.shippingAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Items: {orderData.invoice.items}</p>
                      </div>
                      <div className="border-t border-gray-200 pt-3 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">₹{orderData.invoice.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taxes & Charges:</span>
                          <span className="font-medium">₹{orderData.invoice.taxes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900">Grand Total:</span>
                          <span className="text-gray-900">₹{orderData.invoice.grandTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-black hover:bg-gray-800">
                      Download Invoice
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

