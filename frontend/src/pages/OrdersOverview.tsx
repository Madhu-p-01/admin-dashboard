import { CalendarIcon, UserIcon } from "lucide-react";
import React from "react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Separator } from "../components/ui/Separator";

const paymentDetails = [
  { label: "Subtotal", value: "₹800.40" },
  { label: "Discount", value: "₹0.00" },
  { label: "Shipping Cost", value: "₹10.00" },
  { label: "Tax", value: "₹1.00" },
];

export function OrdersOverview() {
  return (
    <AdminLayout title="Orders Overview">
      <div className="p-6 space-y-6">
        {/* Order Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Orders ID: #6743
            </h2>
            <Badge className="bg-orange-500 text-white px-3 py-1 rounded-lg">
              Pending
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Feb 16,2025 - Feb 20,2025
            </span>
          </div>
        </div>

        {/* Status Controls */}
        <div className="flex items-center gap-4">
          <Select defaultValue="pending">
            <SelectTrigger className="w-48 bg-gray-50 border-gray-200">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="secondary" className="bg-gray-50 text-gray-700 hover:bg-gray-100">
            Save
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Products Card */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src="/api/placeholder/36/36" 
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-gray-900 text-sm">
                        Basic Tee
                      </div>
                      <div className="text-xs text-gray-500">
                        Black - Size S
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="bg-gray-50 rounded px-2 py-1">
                      <span className="text-xs font-medium text-gray-600">
                        Quantity 1
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gray-900">
                      ₹1,230.00
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Card */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {paymentDetails.map((item, index) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gray-200" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹811.40
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address Card */}
            <Card className="border-gray-200">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Deliver to
                </h3>
                <p className="text-sm text-gray-600 leading-6">
                  Address: Dharam Colony, Palam Vihar, Gurgaon, Haryana
                </p>
              </CardContent>
            </Card>

            {/* Notes Card */}
            <Card className="border-gray-200">
              <CardContent className="p-5 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Note:
                </h3>

                <Card className="border-gray-200 bg-gray-50">
                  <CardContent className="p-3">
                    <span className="text-xs text-gray-500">
                      Type some notes
                    </span>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Card */}
            <Card className="border-gray-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gray-200 rounded-lg">
                    <UserIcon className="w-6 h-6 text-gray-600" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Customer
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        Full Name: Shristi Singh
                      </div>
                      <div>
                        Email: shristi@gmail.com
                      </div>
                      <div>
                        Phone: +91 904 231 1212
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  View profile
                </Button>
              </CardContent>
            </Card>

            {/* Invoice Card */}
            <Card className="border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2 whitespace-pre-line">
                  <div>Order Id: #000001</div>
                  <div>billing Address: 123, Mg Road, Bangalore – 560001</div>
                  <div>shipping Address: Same As Billing</div>
                  <div>items: Rib-knit Dress × 1</div>
                  <div>subtotal: ₹2,599.00</div>
                  <div>taxes & Charges: ₹0.00</div>
                  <div>grand Total: ₹2,599.00</div>
                </div>

                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Download Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
