import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../ui/Sidebar';
import { TopBar } from '../ui/TopBar';
import { Icon } from '../ui/Icon';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const navigation = [
  { 
    title: 'Home', 
    href: '/', 
    icon: () => <Icon name="home" size={20} className="text-current" />, 
    isActive: false 
  },
  { 
    title: 'Orders', 
    href: '/orders', 
    icon: () => <Icon name="shopping-cart" size={20} className="text-current" />,
    isActive: false,
    subItems: [
      { title: 'Overview', href: '/orders', isActive: false },
      { title: 'Abandoned Checkout', href: '/checkouts', isActive: false }
    ]
  },
  { 
    title: 'Products', 
    href: '/products', 
    icon: () => <Icon name="package" size={20} className="text-current" />,
    isActive: false,
    subItems: [
      { title: 'Category', href: '/products/category', isActive: false },
      { title: 'Inventory', href: '/products/inventory', isActive: false }
    ]
  },
  { 
    title: 'Customers', 
    href: '/customers', 
    icon: () => <Icon name="users" size={20} className="text-current" />,
    isActive: false
  },
  { 
    title: 'Discount', 
    href: '/discounts', 
    icon: () => <Icon name="percent" size={20} className="text-current" />,
    isActive: false
  },
  { 
    title: 'Catalog', 
    href: '/catalog', 
    icon: () => <Icon name="folder" size={20} className="text-current" />,
    isActive: false
  },
  { 
    title: 'Settings', 
    href: '/settings', 
    icon: () => <Icon name="settings" size={20} className="text-current" />,
    isActive: false
  },
  { 
    title: 'Team', 
    href: '/team', 
    icon: () => <Icon name="users" size={20} className="text-current" />,
    isActive: false
  }
];

const user = {
  id: '1',
  name: 'Johnson Dew',
  email: 'johnsondew11@gmail.com',
  role: 'Admin',
  avatar: '',
};

const branding = {
  title: 'Lily',
  subtitle: 'Admin Dashboard',
  logo: '',
};

const users = [
  { id: '1', name: 'John Doe', role: 'Super Admin', initials: 'JD', color: '#10b981', isOnline: true },
  { id: '2', name: 'Jane Smith', role: 'Editor', initials: 'JS', color: '#3b82f6', isOnline: false },
  { id: '3', name: 'Mike Wilson', role: 'Moderator', initials: 'MW', color: '#8b5cf6', isOnline: true },
];

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();
  
  // Update navigation active states based on current location
  const updatedNavigation = navigation.map(item => {
    const isActive = location.pathname === item.href || 
                    (item.href !== '/' && location.pathname.startsWith(item.href));
    
    return {
      ...item,
      isActive,
      subItems: item.subItems?.map(subItem => ({
        ...subItem,
        isActive: location.pathname === subItem.href
      }))
    };
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        navigation={updatedNavigation}
        user={user}
        branding={branding}
        onLogout={() => console.log('Logout')}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col px-4">
        {/* Top Bar */}
        <TopBar
          title={title}
          users={users}
          onSearch={(value) => console.log('Search:', value)}
          onNotificationClick={() => console.log('Notification clicked')}
        />
        
        {/* Page Content */}
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
