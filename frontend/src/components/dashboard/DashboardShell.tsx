import { PropsWithChildren, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

export interface DashboardNavItem {
	key: string
	label: string
	to: string
	icon?: ReactNode
	chevron?: boolean
}

export interface DashboardShellProps extends PropsWithChildren {
	brand?: ReactNode
	logoText?: string
	navItems: DashboardNavItem[]
	user?: { name: string; email: string; avatarUrl?: string; actionIcon?: ReactNode }
	showSearch?: boolean
}

export default function DashboardShell({ brand, logoText = 'LILY', navItems, user, showSearch = true, children }: DashboardShellProps) {
	return (
		<div className="app-root">
			<aside className="sidebar elevated lily-sidebar">
				<header className="sidebar-header">
					<div className="lily-logo">{brand || logoText}</div>
					<button className="icon-btn" aria-label="collapse"><span>⟲</span></button>
				</header>
				<div className="divider" />
				<nav className="lily-nav">
					{navItems.map(item => (
						<NavLink key={item.key} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
							<span className="nav-icon">{item.icon}</span>
							<span className="nav-label">{item.label}</span>
							{item.chevron ? <span className="nav-chevron">▾</span> : null}
						</NavLink>
					))}
				</nav>
				<div className="sidebar-spacer" />
				<div className="divider" />
				{user && (
					<footer className="sidebar-footer">
						<div className="user-card">
							<img className="avatar" src={user.avatarUrl || 'https://i.pravatar.cc/40?img=12'} alt="avatar" />
							<div className="user-meta">
								<div className="user-name">{user.name}</div>
								<div className="user-mail">{user.email}</div>
							</div>
							<button className="icon-btn small" aria-label="user-action">{user.actionIcon || '⎋'}</button>
						</div>
					</footer>
				)}
			</aside>
			<main className="main">
				<header className="topbar elevated">
					<div className="page-title">Dashboard</div>
					<div className="spacer" />
					{showSearch ? <input className="search" placeholder="Search" /> : null}
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
							<div style={{ width: '24px', height: '24px', backgroundColor: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>J</div>
							<div style={{ width: '24px', height: '24px', backgroundColor: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>A</div>
							<div style={{ width: '24px', height: '24px', backgroundColor: '#F59E0B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>M</div>
							<div style={{ padding: '4px 8px', backgroundColor: '#F3F4F6', borderRadius: '12px', fontSize: '12px', color: 'var(--text)' }}>+100</div>
						</div>
						<button style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
						<div style={{ width: '32px', height: '32px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>🔔</div>
					</div>
				</header>
				<section className="content constrained">{children}</section>
			</main>
		</div>
	)
}





