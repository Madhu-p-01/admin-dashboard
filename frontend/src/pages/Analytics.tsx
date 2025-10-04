import { useState, useCallback } from 'react'
import { useApi } from '@/lib/useApi'
import type { ApiResponse } from '@/types/api'

export default function Analytics() {
	const [activeTab, setActiveTab] = useState('overview')
	const [dateRange, setDateRange] = useState('30d')
	const [fromDate, setFromDate] = useState('')
	const [toDate, setToDate] = useState('')

	// Dashboard Overview
	const overviewTransform = useCallback((res: ApiResponse<any>) => {
		if ((res as any).success === false) throw new Error((res as any).message)
		return (res as any).data
	}, [])

	const { data: overviewData, loading: overviewLoading, error: overviewError } = useApi<any>({
		path: '/api/v1/admin/analytics/dashboard/overview',
		params: { period: dateRange },
		transform: overviewTransform
	})

	// Sales Overview
	const salesTransform = useCallback((res: ApiResponse<any>) => {
		if ((res as any).success === false) throw new Error((res as any).message)
		return (res as any).data
	}, [])

	const { data: salesData, loading: salesLoading, error: salesError } = useApi<any>({
		path: '/api/v1/admin/analytics/sales',
		params: { 
			from: fromDate || undefined, 
			to: toDate || undefined, 
			groupBy: 'day' 
		},
		transform: salesTransform
	})

	// Product Performance
	const { data: productData, loading: productLoading, error: productError } = useApi<any>({
		path: '/api/v1/admin/analytics/products/performance',
		params: { 
			from: fromDate || undefined, 
			to: toDate || undefined, 
			sort: 'top_selling',
			limit: 10
		},
		transform: salesTransform
	})

	// Order Insights
	const { data: orderData, loading: orderLoading, error: orderError } = useApi<any>({
		path: '/api/v1/admin/analytics/orders/insights',
		params: { 
			from: fromDate || undefined, 
			to: toDate || undefined
		},
		transform: salesTransform
	})

	// Customer Insights
	const { data: customerData, loading: customerLoading, error: customerError } = useApi<any>({
		path: '/api/v1/admin/analytics/customers/insights',
		params: { 
			from: fromDate || undefined, 
			to: toDate || undefined
		},
		transform: salesTransform
	})

	// Inventory Insights
	const { data: inventoryData, loading: inventoryLoading, error: inventoryError } = useApi<any>({
		path: '/api/v1/admin/analytics/inventory/insights',
		transform: salesTransform
	})

	// Traffic Insights
	const { data: trafficData, loading: trafficLoading, error: trafficError } = useApi<any>({
		path: '/api/v1/admin/analytics/traffic',
		params: { 
			from: fromDate || undefined, 
			to: toDate || undefined
		},
		transform: salesTransform
	})

	// Refunds Report
	const { data: refundsData, loading: refundsLoading, error: refundsError } = useApi<any>({
		path: '/api/v1/admin/analytics/refunds',
		params: { 
			from: fromDate || undefined, 
			to: toDate || undefined
		},
		transform: salesTransform
	})

	const tabs = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'sales', label: 'Sales' },
		{ id: 'products', label: 'Products' },
		{ id: 'orders', label: 'Orders' },
		{ id: 'customers', label: 'Customers' },
		{ id: 'inventory', label: 'Inventory' },
		{ id: 'traffic', label: 'Traffic' },
		{ id: 'refunds', label: 'Refunds' }
	]

	const renderOverview = () => (
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
			<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
				<h3>Today's Revenue</h3>
				<p style={{ fontSize: '2em', margin: 0, color: '#4ade80' }}>
					₹{overviewData?.sales?.today || 0}
				</p>
				<p style={{ color: '#64748b', margin: 0 }}>
					{overviewData?.sales?.growth > 0 ? '↑' : '↓'} {Math.abs(overviewData?.sales?.growth || 0)}% vs yesterday
				</p>
			</div>
			<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
				<h3>Today's Orders</h3>
				<p style={{ fontSize: '2em', margin: 0, color: '#3b82f6' }}>
					{overviewData?.orders?.today || 0}
				</p>
				<p style={{ color: '#64748b', margin: 0 }}>
					{overviewData?.orders?.growth > 0 ? '↑' : '↓'} {Math.abs(overviewData?.orders?.growth || 0)}% vs yesterday
				</p>
			</div>
			<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
				<h3>Total Customers</h3>
				<p style={{ fontSize: '2em', margin: 0, color: '#f59e0b' }}>
					{overviewData?.customers?.total || 0}
				</p>
				<p style={{ color: '#64748b', margin: 0 }}>
					{overviewData?.customers?.new || 0} new this month
				</p>
			</div>
			<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
				<h3>Conversion Rate</h3>
				<p style={{ fontSize: '2em', margin: 0, color: '#8b5cf6' }}>
					{overviewData?.conversion?.rate || 0}%
				</p>
				<p style={{ color: '#64748b', margin: 0 }}>
					Trend: {overviewData?.conversion?.trend || 'stable'}
				</p>
			</div>
		</div>
	)

	const renderSales = () => (
		<div>
			{salesLoading && <p>Loading sales data...</p>}
			{salesError && <p style={{ color: 'salmon' }}>Error: {salesError}</p>}
			{salesData && (
				<div>
					<h3>Sales Overview</h3>
					<p>Total Revenue: ₹{salesData?.totalRevenue || 0}</p>
					<p>Total Orders: {salesData?.totalOrders || 0}</p>
					<p>Average Order Value: ₹{salesData?.avgOrderValue || 0}</p>
					<div style={{ height: 300, border: '1px dashed #1e2733', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						Sales Chart Placeholder
					</div>
				</div>
			)}
		</div>
	)

	const renderProducts = () => (
		<div>
			{productLoading && <p>Loading product performance...</p>}
			{productError && <p style={{ color: 'salmon' }}>Error: {productError}</p>}
			{productData && (
				<div>
					<h3>Top Performing Products</h3>
					{productData?.products?.map((product: any, index: number) => (
						<div key={index} style={{ padding: 10, border: '1px solid #1e2733', borderRadius: 4, marginBottom: 8 }}>
							<p><strong>{product.name}</strong></p>
							<p>Revenue: ₹{product.revenue || 0}</p>
							<p>Units Sold: {product.unitsSold || 0}</p>
						</div>
					))}
				</div>
			)}
		</div>
	)

	const renderOrders = () => (
		<div>
			{orderLoading && <p>Loading order insights...</p>}
			{orderError && <p style={{ color: 'salmon' }}>Error: {orderError}</p>}
			{orderData && (
				<div>
					<h3>Order Insights</h3>
					<p>Total Orders: {orderData?.totalOrders || 0}</p>
					<p>Average Order Value: ₹{orderData?.avgOrderValue || 0}</p>
					<p>Order Status Distribution:</p>
					<ul>
						{Object.entries(orderData?.statusDistribution || {}).map(([status, count]) => (
							<li key={status}>{status}: {count as number}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)

	const renderCustomers = () => (
		<div>
			{customerLoading && <p>Loading customer insights...</p>}
			{customerError && <p style={{ color: 'salmon' }}>Error: {customerError}</p>}
			{customerData && (
				<div>
					<h3>Customer Insights</h3>
					<p>Total Customers: {customerData?.totalCustomers || 0}</p>
					<p>New Customers: {customerData?.newCustomers || 0}</p>
					<p>Returning Customers: {customerData?.returningCustomers || 0}</p>
					<p>Customer Lifetime Value: ₹{customerData?.avgLifetimeValue || 0}</p>
				</div>
			)}
		</div>
	)

	const renderInventory = () => (
		<div>
			{inventoryLoading && <p>Loading inventory insights...</p>}
			{inventoryError && <p style={{ color: 'salmon' }}>Error: {inventoryError}</p>}
			{inventoryData && (
				<div>
					<h3>Inventory Insights</h3>
					<p>Total Products: {inventoryData?.totalProducts || 0}</p>
					<p>Low Stock Items: {inventoryData?.lowStockItems || 0}</p>
					<p>Out of Stock Items: {inventoryData?.outOfStockItems || 0}</p>
					<p>Total Inventory Value: ₹{inventoryData?.totalValue || 0}</p>
				</div>
			)}
		</div>
	)

	const renderTraffic = () => (
		<div>
			{trafficLoading && <p>Loading traffic insights...</p>}
			{trafficError && <p style={{ color: 'salmon' }}>Error: {trafficError}</p>}
			{trafficData && (
				<div>
					<h3>Traffic & Conversion</h3>
					<p>Total Visitors: {trafficData?.totalVisitors || 0}</p>
					<p>Conversion Rate: {trafficData?.conversionRate || 0}%</p>
					<p>Bounce Rate: {trafficData?.bounceRate || 0}%</p>
					<p>Average Session Duration: {trafficData?.avgSessionDuration || 0} minutes</p>
				</div>
			)}
		</div>
	)

	const renderRefunds = () => (
		<div>
			{refundsLoading && <p>Loading refunds report...</p>}
			{refundsError && <p style={{ color: 'salmon' }}>Error: {refundsError}</p>}
			{refundsData && (
				<div>
					<h3>Refunds & Returns</h3>
					<p>Total Refunds: {refundsData?.totalRefunds || 0}</p>
					<p>Refund Amount: ₹{refundsData?.totalRefundAmount || 0}</p>
					<p>Refund Rate: {refundsData?.refundRate || 0}%</p>
					<p>Average Refund Amount: ₹{refundsData?.avgRefundAmount || 0}</p>
				</div>
			)}
		</div>
	)

	return (
		<div>
			<h1>Analytics Dashboard</h1>
			
			{/* Date Range Controls */}
			<div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
				<label htmlFor="date-range-select" style={{ display: 'none' }}>Select date range</label>
				<select
					id="date-range-select"
					title="Select date range"
					value={dateRange}
					onChange={(e) => setDateRange(e.target.value)}
				>
					<option value="7d">Last 7 days</option>
					<option value="30d">Last 30 days</option>
					<option value="90d">Last 90 days</option>
					<option value="1y">Last year</option>
				</select>
				<input
					type="date"
					placeholder="From Date"
					value={fromDate}
					onChange={(e) => setFromDate(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
				<input
					type="date"
					placeholder="To Date"
					value={toDate}
					onChange={(e) => setToDate(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
			</div>

			{/* Tab Navigation */}
			<div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
				{tabs.map(tab => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						style={{
							padding: '8px 16px',
							border: '1px solid #1e2733',
							borderRadius: 4,
							background: activeTab === tab.id ? '#3b82f6' : '#0f1419',
							color: 'white',
							cursor: 'pointer'
						}}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab Content */}
			{activeTab === 'overview' && renderOverview()}
			{activeTab === 'sales' && renderSales()}
			{activeTab === 'products' && renderProducts()}
			{activeTab === 'orders' && renderOrders()}
			{activeTab === 'customers' && renderCustomers()}
			{activeTab === 'inventory' && renderInventory()}
			{activeTab === 'traffic' && renderTraffic()}
			{activeTab === 'refunds' && renderRefunds()}
		</div>
	)
}



