import { PropsWithChildren } from 'react'

export function Card({ children }: PropsWithChildren) {
	return <div className="card">{children}</div>
}

export function StatCard({ label, value, delta }: { label: string; value: string | number; delta?: string }) {
	return (
		<div className="card stat" style={{ 
			display: 'flex', 
			flexDirection: 'column', 
			gap: '8px',
			position: 'relative',
			overflow: 'hidden'
		}}>
			<div style={{ 
				position: 'absolute', 
				top: '16px', 
				right: '16px', 
				width: '40px', 
				height: '40px', 
				borderRadius: '50%', 
				backgroundColor: 'var(--primary)', 
				opacity: 0.1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: '20px'
			}}>
				{label === 'Net Income' && '⚙️'}
				{label === 'Total Revenue' && '📊'}
				{label === 'Orders' && '🛒'}
				{label === 'Conversion' && '🔄'}
			</div>
			<span className="label">{label}</span>
			<span className="value">{value}</span>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				{delta ? <span className="delta">{delta}</span> : null}
				<a href="#" style={{ 
					fontSize: '12px', 
					color: 'var(--primary)', 
					textDecoration: 'none',
					fontWeight: '500'
				}}>View report</a>
			</div>
		</div>
	)
}





