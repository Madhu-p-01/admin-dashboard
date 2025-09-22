# @syntellite/admin-dashboard-ui

A comprehensive, reusable admin dashboard UI library built with React, TypeScript, and Tailwind CSS. Perfect for building modern admin interfaces with consistent design and functionality.

## Features

- 🎨 **Modern Design**: Clean, professional admin interface
- 🔧 **Highly Customizable**: Configurable themes, branding, and layouts
- 📱 **Responsive**: Mobile-first design that works on all devices
- ⚡ **Performance**: Optimized components with minimal bundle size
- 🎯 **TypeScript**: Full type safety and excellent developer experience
- 🎨 **Tailwind CSS**: Utility-first styling with design system
- 📦 **Tree Shakeable**: Import only what you need

## Installation

```bash
npm install @syntellite/admin-dashboard-ui
# or
yarn add @syntellite/admin-dashboard-ui
# or
pnpm add @syntellite/admin-dashboard-ui
```

## Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react react-dom next tailwindcss lucide-react
```

## Quick Start

### 1. Basic Setup

```tsx
import { AdminLayout } from '@syntellite/admin-dashboard-ui';
import { Home, Users, Settings } from 'lucide-react';

const navigation = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
    isActive: true
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    badge: '12'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
];

const user = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Administrator',
  avatar: '/avatar.jpg'
};

function AdminApp() {
  return (
    <AdminLayout
      navigation={navigation}
      user={user}
      branding={{
        title: 'My Admin',
        logo: '/logo.png'
      }}
      onLogout={() => console.log('Logout')}
    >
      <h1>Dashboard Content</h1>
    </AdminLayout>
  );
}
```

### 2. With Navigation Groups

```tsx
const navigationGroups = [
  {
    title: 'Main',
    items: [
      { title: 'Dashboard', href: '/admin', icon: Home },
      { title: 'Analytics', href: '/admin/analytics', icon: BarChart }
    ]
  },
  {
    title: 'Management',
    items: [
      { title: 'Users', href: '/admin/users', icon: Users },
      { title: 'Products', href: '/admin/products', icon: Package }
    ]
  }
];

<AdminLayout navigation={navigationGroups} user={user}>
  {/* Your content */}
</AdminLayout>
```

### 3. Custom Theme

```tsx
const customTheme = {
  colors: {
    primary: 'hsl(221.2 83.2% 53.3%)',
    secondary: 'hsl(210 40% 96%)',
    background: 'hsl(0 0% 100%)',
    sidebar: 'hsl(222.2 84% 4.9%)',
    // ... other colors
  }
};

<AdminLayout
  navigation={navigation}
  user={user}
  theme={customTheme}
>
  {/* Your content */}
</AdminLayout>
```

## Components

### AdminLayout

The main layout component that provides the complete admin interface structure.

```tsx
interface AdminLayoutProps {
  children: ReactNode;
  navigation: NavigationItem[] | NavigationGroup[];
  user: User;
  branding?: BrandingConfig;
  theme?: Partial<AdminTheme>;
  onLogout?: () => void;
  onUserMenuClick?: (action: string) => void;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  className?: string;
}
```

### Sidebar

Standalone sidebar component for custom layouts.

```tsx
<Sidebar
  navigation={navigation}
  branding={branding}
  collapsed={false}
  onToggle={() => {}}
/>
```

### TopBar

Standalone top bar component for custom layouts.

```tsx
<TopBar
  user={user}
  onLogout={() => {}}
  onSidebarToggle={() => {}}
  sidebarCollapsed={false}
/>
```

## Types

### NavigationItem

```tsx
interface NavigationItem {
  title: string;
  href: string;
  icon?: LucideIcon | string;
  badge?: string | number;
  children?: NavigationItem[];
  isActive?: boolean;
  disabled?: boolean;
}
```

### User

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions?: string[];
}
```

### BrandingConfig

```tsx
interface BrandingConfig {
  logo?: string;
  logoUrl?: string;
  title: string;
  subtitle?: string;
  favicon?: string;
  colors?: Partial<AdminTheme['colors']>;
}
```

## Utilities

The package includes helpful utility functions:

```tsx
import {
  cn,                    // Merge Tailwind classes
  formatNumber,          // Format numbers with commas
  formatCurrency,        // Format currency values
  formatDate,           // Format dates
  formatRelativeTime,   // "2 hours ago"
  getInitials,          // Get initials from name
  // ... and many more
} from '@syntellite/admin-dashboard-ui';
```

## Styling

### Tailwind CSS Setup

Add the package path to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@syntellite/admin-dashboard-ui/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
}
```

### CSS Variables

Add these CSS variables to your global CSS:

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

## Examples

Check out the `/examples` directory for complete implementation examples:

- Basic admin dashboard
- E-commerce admin
- Multi-tenant application
- Custom theme implementation

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Syntellite](https://github.com/syntellite)

## Support

- 📖 [Documentation](https://admin-ui.syntellite.com)
- 🐛 [Issue Tracker](https://github.com/syntellite/admin-dashboard-ui/issues)
- 💬 [Discussions](https://github.com/syntellite/admin-dashboard-ui/discussions)
