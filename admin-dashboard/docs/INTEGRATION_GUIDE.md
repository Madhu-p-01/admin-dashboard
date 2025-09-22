# Integration Guide

This guide shows how to integrate `@syntellite/admin-dashboard-ui` into your projects.

## Installation Steps

### 1. Install the Package

For published package:
```bash
npm install @syntellite/admin-dashboard-ui
```

For local development:
```bash
# In your project's package.json
"dependencies": {
  "@syntellite/admin-dashboard-ui": "file:../admin-dashboard-ui"
}
```

### 2. Install Peer Dependencies

```bash
npm install react react-dom next tailwindcss lucide-react
```

### 3. Update Tailwind Configuration

Add the package path to your `tailwind.config.js` or `tailwind.config.ts`:

```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@syntellite/admin-dashboard-ui/dist/**/*.{js,ts,jsx,tsx}'
  ],
  // ... rest of your config
}
```

### 4. Add CSS Variables

Add these CSS variables to your global CSS file:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}
```

## Integration with Ecommerce Project

### 1. Create Admin Layout

Create `src/app/admin/layout.tsx`:

```tsx
import { AdminLayout } from '@syntellite/admin-dashboard-ui';
import { ecommerceNavigation, adminUser, ecommerceBranding } from './config';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = () => {
    // Implement logout logic
    window.location.href = '/admin/login';
  };

  const handleUserMenuClick = (action: string) => {
    switch (action) {
      case 'profile':
        window.location.href = '/admin/profile';
        break;
      case 'settings':
        window.location.href = '/admin/settings';
        break;
    }
  };

  return (
    <AdminLayout
      navigation={ecommerceNavigation}
      user={adminUser}
      branding={ecommerceBranding}
      onLogout={handleLogout}
      onUserMenuClick={handleUserMenuClick}
    >
      {children}
    </AdminLayout>
  );
}
```

### 2. Create Configuration

Create `src/app/admin/config.ts`:

```tsx
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

export const ecommerceNavigation = [
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

export const adminUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@ecommerce.com',
  role: 'Administrator',
  avatar: '/admin-avatar.jpg',
  permissions: ['manage_products', 'manage_orders', 'manage_users'],
};

export const ecommerceBranding = {
  title: 'ECommerce Admin',
  subtitle: 'Store Management',
  logo: '/ecommerce-logo.png',
};
```

### 3. Create Admin Pages

Create `src/app/admin/page.tsx`:

```tsx
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your ecommerce admin dashboard
        </p>
      </div>
      
      {/* Your dashboard content */}
    </div>
  );
}
```

### 4. Build the Package

Before using in your project, build the admin dashboard package:

```bash
cd admin-dashboard-ui
npm run build
```

### 5. Link for Local Development

For local development, you can link the package:

```bash
# In admin-dashboard-ui directory
npm link

# In your ecommerce project directory
npm link @syntellite/admin-dashboard-ui
```

## Publishing the Package

### 1. Update Version

```bash
cd admin-dashboard-ui
npm version patch  # or minor/major
```

### 2. Build and Publish

```bash
npm run build
npm publish
```

### 3. Install in Projects

```bash
npm install @syntellite/admin-dashboard-ui@latest
```

## Troubleshooting

### Common Issues

1. **CSS Variables Not Working**: Make sure you've added the CSS variables to your global CSS file.

2. **Tailwind Classes Not Applied**: Ensure the package path is included in your Tailwind config.

3. **TypeScript Errors**: Make sure all peer dependencies are installed.

4. **Build Errors**: Check that the package is built before using it locally.

### Getting Help

- Check the [README](../README.md) for basic usage
- Look at [examples](../examples/) for implementation patterns
- Open an issue on GitHub for bugs or feature requests
