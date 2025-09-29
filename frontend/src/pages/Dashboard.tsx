import { useState } from 'react'

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState('daily')

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
			{/* Statistics Cards */}
			<div className="grid cols-4">
				{/* Net Income Card */}
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
						backgroundColor: '#5b9dff',
						opacity: 0.1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '20px'
					}}>
						⚙️
					</div>
					<span className="label">Net Income</span>
					<span className="value">₹7,825</span>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span className="delta">+0.16%</span>
						<a href="#" style={{
							fontSize: '12px',
							color: '#5b9dff',
							textDecoration: 'none',
							fontWeight: '500'
						}}>View report</a>
					</div>
				</div>

				{/* Total Revenue Card */}
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
						backgroundColor: '#5b9dff',
						opacity: 0.1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '20px'
					}}>
						📊
					</div>
					<span className="label">Total Revenue</span>
					<span className="value">₹7,825</span>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span className="delta">+0.08%</span>
						<a href="#" style={{
							fontSize: '12px',
							color: '#5b9dff',
							textDecoration: 'none',
							fontWeight: '500'
						}}>View report</a>
					</div>
				</div>

				{/* Orders Card */}
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
						backgroundColor: '#5b9dff',
						opacity: 0.1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '20px'
					}}>
						🛒
					</div>
					<span className="label">Orders</span>
					<span className="value">740</span>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span className="delta">+0.10%</span>
						<a href="#" style={{
							fontSize: '12px',
							color: '#5b9dff',
							textDecoration: 'none',
							fontWeight: '500'
						}}>View report</a>
					</div>
				</div>

				{/* Conversion Card */}
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
						backgroundColor: '#5b9dff',
						opacity: 0.1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '20px'
					}}>
						🔄
					</div>
					<span className="label">Conversion</span>
					<span className="value">28%</span>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span className="delta">+0.18%</span>
						<a href="#" style={{
							fontSize: '12px',
							color: '#5b9dff',
							textDecoration: 'none',
							fontWeight: '500'
						}}>View report</a>
					</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
				{/* Revenue Chart */}
				<div className="card">
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
						<h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>Revenue</h2>
						<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
							<select style={{
								padding: '6px 12px',
								border: '1px solid #E5E7EB',
								borderRadius: '6px',
								backgroundColor: '#FFFFFF',
								color: '#1F2937',
								fontSize: '14px'
							}}>
								<option>This week</option>
							</select>
							<label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1F2937' }}>
								<input type="checkbox" defaultChecked style={{ margin: 0 }} />
								Orders
							</label>
						</div>
					</div>
					<div style={{ 
						height: '200px', 
						backgroundColor: '#F9FAFB', 
						borderRadius: '8px', 
						display: 'flex', 
						alignItems: 'center', 
						justifyContent: 'center',
						border: '1px solid #E5E7EB',
						color: '#8aa0b6',
						fontSize: '14px',
						position: 'relative'
					}}>
						{/* Y-axis labels */}
						<div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '12px', color: '#8aa0b6' }}>
							<div>0</div>
							<div>9K</div>
							<div>18K</div>
							<div>27K</div>
							<div>36K</div>
						</div>
						{/* X-axis labels */}
						<div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8aa0b6' }}>
							<span>Mon</span>
							<span>Tue</span>
							<span>Wed</span>
							<span>Thu</span>
							<span style={{ color: '#5b9dff', fontWeight: '600' }}>Fri</span>
							<span>Sat</span>
							<span>Sun</span>
						</div>
						{/* Tooltip */}
						<div style={{ 
							position: 'absolute', 
							top: '50px', 
							left: '50%', 
							transform: 'translateX(-50%)',
							backgroundColor: '#FFFFFF',
							padding: '8px 12px',
							borderRadius: '6px',
							border: '1px solid #E5E7EB',
							fontSize: '12px',
							color: '#1F2937',
							boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
						}}>
							Fri: 18,298
						</div>
						{/* Chart placeholder */}
						<div style={{ textAlign: 'center' }}>
							<div style={{ fontSize: '16px', marginBottom: '8px' }}>📊</div>
							<div>Line Chart Placeholder</div>
						</div>
					</div>
				</div>

				{/* Visitors Trends */}
				<div className="card">
					<h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>Visitors Trends</h2>
					<div style={{ 
						height: '200px', 
						backgroundColor: '#F9FAFB', 
						borderRadius: '8px', 
						display: 'flex', 
						alignItems: 'center', 
						justifyContent: 'center',
						border: '1px solid #E5E7EB',
						color: '#8aa0b6',
						fontSize: '14px',
						position: 'relative'
					}}>
						{/* Legend */}
						<div style={{ 
							position: 'absolute', 
							bottom: '20px', 
							left: '20px', 
							display: 'flex', 
							flexDirection: 'column', 
							gap: '8px' 
						}}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
								<div style={{ width: '8px', height: '8px', backgroundColor: '#5b9dff', borderRadius: '50%' }}></div>
								<span>New Visitors (75%)</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
								<div style={{ width: '8px', height: '8px', backgroundColor: '#93C5FD', borderRadius: '50%' }}></div>
								<span>Returning Visitors (25%)</span>
							</div>
						</div>
						{/* Chart placeholder */}
						<div style={{ textAlign: 'center' }}>
							<div style={{ fontSize: '16px', marginBottom: '8px' }}>🍩</div>
							<div>Donut Chart Placeholder</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Row */}
			<div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
				{/* Most Sold Items */}
				<div className="card">
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
						<h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>Most Sold Items</h2>
						<div style={{ display: 'flex', gap: '4px' }}>
							<button 
								onClick={() => setActiveTab('daily')}
								style={{
									padding: '6px 12px',
									backgroundColor: activeTab === 'daily' ? '#5b9dff' : 'transparent',
									color: activeTab === 'daily' ? 'white' : '#8aa0b6',
									border: 'none',
									borderRadius: '6px',
									fontSize: '12px',
									cursor: 'pointer'
								}}
							>
								Daily
							</button>
							<button 
								onClick={() => setActiveTab('weekly')}
								style={{
									padding: '6px 12px',
									backgroundColor: activeTab === 'weekly' ? '#5b9dff' : 'transparent',
									color: activeTab === 'weekly' ? 'white' : '#8aa0b6',
									border: '1px solid #E5E7EB',
									borderRadius: '6px',
									fontSize: '12px',
									cursor: 'pointer'
								}}
							>
								Weekly
							</button>
							<button 
								onClick={() => setActiveTab('monthly')}
								style={{
									padding: '6px 12px',
									backgroundColor: activeTab === 'monthly' ? '#5b9dff' : 'transparent',
									color: activeTab === 'monthly' ? 'white' : '#8aa0b6',
									border: '1px solid #E5E7EB',
									borderRadius: '6px',
									fontSize: '12px',
									cursor: 'pointer'
								}}
							>
								Monthly
							</button>
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
								<span style={{ fontSize: '14px', color: '#1F2937' }}>Top</span>
								<span style={{ fontSize: '12px', color: '#8aa0b6' }}>75%</span>
							</div>
							<div style={{ width: '100%', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
								<div style={{ width: '75%', height: '100%', backgroundColor: '#5b9dff', borderRadius: '3px' }}></div>
							</div>
						</div>
						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
								<span style={{ fontSize: '14px', color: '#1F2937' }}>Shirts</span>
								<span style={{ fontSize: '12px', color: '#8aa0b6' }}>35%</span>
							</div>
							<div style={{ width: '100%', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
								<div style={{ width: '35%', height: '100%', backgroundColor: '#5b9dff', borderRadius: '3px' }}></div>
							</div>
						</div>
						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
								<span style={{ fontSize: '14px', color: '#1F2937' }}>Pants</span>
								<span style={{ fontSize: '12px', color: '#8aa0b6' }}>85%</span>
							</div>
							<div style={{ width: '100%', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
								<div style={{ width: '85%', height: '100%', backgroundColor: '#5b9dff', borderRadius: '3px' }}></div>
							</div>
						</div>
						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
								<span style={{ fontSize: '14px', color: '#1F2937' }}>Kurthi</span>
								<span style={{ fontSize: '12px', color: '#8aa0b6' }}>75%</span>
							</div>
							<div style={{ width: '100%', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
								<div style={{ width: '75%', height: '100%', backgroundColor: '#5b9dff', borderRadius: '3px' }}></div>
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
						<div style={{ display: 'flex', gap: '4px' }}>
							<button style={{ width: '24px', height: '24px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>‹</button>
							<button style={{ width: '24px', height: '24px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>›</button>
						</div>
					</div>
				</div>

				{/* Products Added */}
				<div className="card">
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
						<h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>Products Added</h2>
						<div style={{ display: 'flex', gap: '8px' }}>
							<button style={{ width: '24px', height: '24px', backgroundColor: '#5b9dff', border: 'none', borderRadius: '4px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
							<button style={{ width: '24px', height: '24px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>⋯</button>
						</div>
					</div>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
						<div style={{ textAlign: 'center' }}>
							<div style={{ width: '100%', height: '80px', backgroundColor: '#F3F4F6', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8aa0b6' }}>👗</div>
							<div style={{ fontSize: '12px', color: '#1F2937', marginBottom: '4px' }}>Black Bodycon Dress</div>
							<div style={{ fontSize: '12px', color: '#8aa0b6' }}>₹1270</div>
						</div>
						<div style={{ textAlign: 'center' }}>
							<div style={{ width: '100%', height: '80px', backgroundColor: '#F3F4F6', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8aa0b6' }}>👗</div>
							<div style={{ fontSize: '12px', color: '#1F2937', marginBottom: '4px' }}>Pink Bodycon Dress</div>
							<div style={{ fontSize: '12px', color: '#8aa0b6' }}>₹1270</div>
						</div>
						<div style={{ textAlign: 'center' }}>
							<div style={{ width: '100%', height: '80px', backgroundColor: '#F3F4F6', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8aa0b6' }}>👗</div>
							<div style={{ fontSize: '12px', color: '#1F2937', marginBottom: '4px' }}>Floral/Patterned Pink Dress</div>
							<div style={{ fontSize: '12px', color: '#8aa0b6' }}>₹1270</div>
						</div>
						<div style={{ textAlign: 'center' }}>
							<div style={{ width: '100%', height: '80px', backgroundColor: '#F3F4F6', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8aa0b6' }}>👗</div>
							<div style={{ fontSize: '12px', color: '#1F2937', marginBottom: '4px' }}>Light Blue Strap Dress</div>
							<div style={{ fontSize: '12px', color: '#8aa0b6' }}>₹1270</div>
						</div>
					</div>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<a href="#" style={{ fontSize: '12px', color: '#5b9dff', textDecoration: 'none' }}>View All</a>
						<div style={{ display: 'flex', gap: '4px' }}>
							<button style={{ width: '24px', height: '24px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>‹</button>
							<button style={{ width: '24px', height: '24px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>›</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}


