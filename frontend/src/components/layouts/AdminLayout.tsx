import { PropsWithChildren } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default function AdminLayout({ children }: PropsWithChildren) {
	return (
		<DashboardShell
			logoText="LILY"
			navItems={defaultNavItems}
			user={{ name: 'Johnson Dew', email: 'johnsondew11@gmail.com' }}
		>
			{children}
		</DashboardShell>
	)
}

const defaultNavItems = [
	{ key: 'home', label: 'Home', to: '/dashboard', icon: '🏠', chevron: false },
	{ key: 'orders', label: 'Orders', to: '/orders', icon: '📋', chevron: true },
	{ key: 'products', label: 'Products', to: '/products', icon: '📦', chevron: true },
	{ key: 'customers', label: 'Customers', to: '/customers', icon: '👥', chevron: false },
	{ key: 'discount', label: 'Discount', to: '/discounts', icon: '🏷️', chevron: false },
	{ key: 'catalog', label: 'Catalog', to: '/analytics', icon: '📚', chevron: false },
	{ key: 'settings', label: 'Settings', to: '/settings', icon: '⚙️', chevron: false }
]


