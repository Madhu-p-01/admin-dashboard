// Example: How to integrate @syntellite/admin-dashboard-ui into the ecommerce project

import { AdminLayout } from '@syntellite/admin-dashboard-ui';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Tag,
  Truck,
} from 'lucide-react';

// Define navigation for ecommerce admin
const ecommerceNavigation = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Catalog',
    items: [
      {
        title: 'Products',
        href: '/admin/products',
        icon: Package,
        badge: '156',
      },
      {
        title: 'Categories',
        href: '/admin/categories',
        icon: Tag,
      },
    ],
  },
  {
    title: 'Sales',
    items: [
      {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingCart,
        badge: '23',
      },
      {
        title: 'Customers',
        href: '/admin/customers',
        icon: Users,
      },
      {
        title: 'Shipping',
        href: '/admin/shipping',
        icon: Truck,
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];

// Mock user data
const adminUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@ecommerce.com',
  role: 'Administrator',
  avatar: '/admin-avatar.jpg',
  permissions: ['manage_products', 'manage_orders', 'manage_users'],
};

// Ecommerce branding
const ecommerceBranding = {
  title: 'ECommerce Admin',
  subtitle: 'Store Management',
  logo: '/ecommerce-logo.png',
};

// Example admin layout wrapper
export function EcommerceAdminLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
    // Redirect to login page
    window.location.href = '/admin/login';
  };

  const handleUserMenuClick = (action: string) => {
    switch (action) {
      case 'profile':
        // Navigate to profile page
        window.location.href = '/admin/profile';
        break;
      case 'settings':
        // Navigate to settings page
        window.location.href = '/admin/settings';
        break;
      default:
        console.log('User menu action:', action);
    }
  };

  return (
    <AdminLayout
      navigation={ecommerceNavigation}
      user={adminUser}
      branding={ecommerceBranding}
      onLogout={handleLogout}
      onUserMenuClick={handleUserMenuClick}
      className="min-h-screen"
    >
      {children}
    </AdminLayout>
  );
}

// Example usage in Next.js app router
// File: src/app/admin/layout.tsx
export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EcommerceAdminLayout>{children}</EcommerceAdminLayout>;
}

// Example dashboard page
// File: src/app/admin/page.tsx
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your ecommerce admin dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">₹1,24,567</p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <p className="text-xs text-green-600 mt-2">+12% from last month</p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Orders</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
          <p className="text-xs text-green-600 mt-2">+8% from last month</p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Products</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
          <p className="text-xs text-blue-600 mt-2">5 new this week</p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customers</p>
              <p className="text-2xl font-bold">2,345</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
          <p className="text-xs text-green-600 mt-2">+15% from last month</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Order #{1000 + order}</p>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{(Math.random() * 5000 + 1000).toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
