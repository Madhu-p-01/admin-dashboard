import { useMemo, useState, useCallback } from 'react'
import { useApi } from '@/lib/useApi'
import { api } from '@/lib/api'
import type { ApiResponse, PaginatedResult, CustomerListItem } from '@/types/api'

export default function Customers() {
	const [activeTab, setActiveTab] = useState('list')
	const [page, setPage] = useState(1)
	const [limit] = useState(10)
	const [search, setSearch] = useState('')
	const [status, setStatus] = useState('')
	const [sort, setSort] = useState('latest')
	const [minOrders, setMinOrders] = useState('')
	const [minSpent, setMinSpent] = useState('')

	// Customer Form State
	const [showForm, setShowForm] = useState(false)
	const [editingCustomer, setEditingCustomer] = useState<CustomerListItem | null>(null)
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		status: 'active' as 'active' | 'inactive' | 'blacklisted' | 'suspended'
	})

	// Customer Details State
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerListItem | null>(null)
	const [customerDetails, setCustomerDetails] = useState<any>(null)
	const [customerOrders, setCustomerOrders] = useState<any[]>([])

	// Loyalty Points State
	const [loyaltyPoints, setLoyaltyPoints] = useState('')
	const [loyaltyReason, setLoyaltyReason] = useState('')

	const transform = useCallback((res: ApiResponse<{ data: PaginatedResult<CustomerListItem> }>) => {
		if ((res as any).success === false) throw new Error((res as any).message)
		return (res as any).data
	}, [])

	const { data, loading, error } = useApi<{ data: PaginatedResult<CustomerListItem> }>({
		path: '/customers',
		params: { 
			page, 
			limit, 
			search: search || undefined,
			status: status || undefined,
			sort,
			minOrders: minOrders || undefined,
			minSpent: minSpent || undefined
		},
		transform
	})

	// Customer Segments
	const { data: segmentsData, loading: segmentsLoading } = useApi<any>({
		path: '/customers/segments',
		transform: useCallback((res: ApiResponse<any>) => (res as any).data, [])
	})

	const customers = data?.data || []
	const meta = data?.meta
	const segments = segmentsData || []
	const totalPages = useMemo(() => meta?.totalPages || 1, [meta])

	const tabs = [
		{ id: 'list', label: 'All Customers' },
		{ id: 'search', label: 'Search Customers' },
		{ id: 'segments', label: 'Customer Segments' },
		{ id: 'loyalty', label: 'Loyalty Management' },
		{ id: 'export', label: 'Export Customers' }
	]

	const handleUpdateCustomer = async (id: string) => {
		try {
			await api.request(`/customers/${id}`, 'PUT', formData)
			setShowForm(false)
			setEditingCustomer(null)
			// Refresh the list
			window.location.reload()
		} catch (error) {
			console.error('Error updating customer:', error)
		}
	}

	const handleDeleteCustomer = async (id: string) => {
		if (confirm('Are you sure you want to delete this customer?')) {
			try {
				await api.request(`/customers/${id}`, 'DELETE')
				// Refresh the list
				window.location.reload()
			} catch (error) {
				console.error('Error deleting customer:', error)
			}
		}
	}

	const handleUpdateStatus = async (id: string, newStatus: string, reason?: string) => {
		try {
			await api.request(`/customers/${id}/status`, 'PUT', { 
				status: newStatus,
				reason: reason || undefined
			})
			// Refresh the list
			window.location.reload()
		} catch (error) {
			console.error('Error updating status:', error)
		}
	}

	const handleGetCustomerDetails = async (customer: CustomerListItem) => {
		try {
			const details = await api.request(`/customers/${customer.id}`, 'GET')
			const orders = await api.request(`/customers/${customer.id}/orders`, 'GET')
			setCustomerDetails(details)
			setCustomerOrders(orders)
			setSelectedCustomer(customer)
		} catch (error) {
			console.error('Error fetching customer details:', error)
		}
	}

	const handleAddLoyaltyPoints = async (customerId: string) => {
		try {
			await api.request(`/customers/${customerId}/loyalty/add`, 'POST', {
				points: parseInt(loyaltyPoints),
				reason: loyaltyReason
			})
			setLoyaltyPoints('')
			setLoyaltyReason('')
			// Refresh customer details
			if (selectedCustomer) {
				handleGetCustomerDetails(selectedCustomer)
			}
		} catch (error) {
			console.error('Error adding loyalty points:', error)
		}
	}

	const handleRedeemLoyaltyPoints = async (customerId: string) => {
		try {
			await api.request(`/customers/${customerId}/loyalty/redeem`, 'POST', {
				points: parseInt(loyaltyPoints),
				reason: loyaltyReason
			})
			setLoyaltyPoints('')
			setLoyaltyReason('')
			// Refresh customer details
			if (selectedCustomer) {
				handleGetCustomerDetails(selectedCustomer)
			}
		} catch (error) {
			console.error('Error redeeming loyalty points:', error)
		}
	}

	const handleExportCustomers = async (format: string) => {
		try {
			const response = await api.request(`/customers/export?format=${format}`, 'GET')
			// Handle file download
			console.log('Export response:', response)
			alert(`Customers exported as ${format.toUpperCase()}`)
		} catch (error) {
			console.error('Error exporting customers:', error)
		}
	}

	const renderCustomerList = () => (
		<div>
			{/* Filters */}
			<div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
				<input
					type="text"
					placeholder="Search customers..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
				<select value={status} onChange={(e) => setStatus(e.target.value)}>
					<option value="">All Status</option>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
					<option value="blacklisted">Blacklisted</option>
					<option value="suspended">Suspended</option>
				</select>
				<select value={sort} onChange={(e) => setSort(e.target.value)}>
					<option value="latest">Latest</option>
					<option value="oldest">Oldest</option>
					<option value="name_asc">Name A-Z</option>
					<option value="name_desc">Name Z-A</option>
					<option value="total_spent_desc">Highest Spent</option>
					<option value="total_spent_asc">Lowest Spent</option>
					<option value="orders_desc">Most Orders</option>
				</select>
				<input
					type="number"
					placeholder="Min Orders"
					value={minOrders}
					onChange={(e) => setMinOrders(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white', width: 120 }}
				/>
				<input
					type="number"
					placeholder="Min Spent"
					value={minSpent}
					onChange={(e) => setMinSpent(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white', width: 120 }}
				/>
			</div>

			{loading && <p>Loading...</p>}
			{error && <p style={{ color: 'salmon' }}>Error: {error}</p>}
			{!loading && !error && customers.length === 0 && (
				<p>No customers found.</p>
			)}
			{!loading && !error && customers.length > 0 && (
				<div>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr>
								<th align="left">Name</th>
								<th align="left">Email</th>
								<th align="left">Phone</th>
								<th align="left">Orders</th>
								<th align="left">Total Spent</th>
								<th align="left">Status</th>
								<th align="left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{customers.map((customer) => (
								<tr key={customer.id} style={{ borderTop: '1px solid #1e2733' }}>
									<td>{customer.name}</td>
									<td>{customer.email}</td>
									<td>{customer.phone || 'N/A'}</td>
									<td>{customer.ordersCount || 0}</td>
									<td>₹{customer.totalSpent || 0}</td>
									<td>
										<select 
											value={customer.status || 'active'} 
											onChange={(e) => handleUpdateStatus(customer.id, e.target.value)}
											style={{ padding: 4, background: '#0f1419', color: 'white', border: '1px solid #1e2733' }}
										>
											<option value="active">Active</option>
											<option value="inactive">Inactive</option>
											<option value="blacklisted">Blacklisted</option>
											<option value="suspended">Suspended</option>
										</select>
									</td>
									<td>
										<button 
											onClick={() => handleGetCustomerDetails(customer)}
											style={{ padding: 4, marginRight: 4, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4 }}
										>
											View
										</button>
										<button 
											onClick={() => {
												setEditingCustomer(customer)
												setFormData({
													name: customer.name,
													phone: customer.phone || '',
													status: customer.status || 'active'
												})
												setShowForm(true)
											}}
											style={{ padding: 4, marginRight: 4, background: '#10b981', color: 'white', border: 'none', borderRadius: 4 }}
										>
											Edit
										</button>
										<button 
											onClick={() => handleDeleteCustomer(customer.id)}
											style={{ padding: 4, background: '#ef4444', color: 'white', border: 'none', borderRadius: 4 }}
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
						<button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
						<span>Page {page} / {totalPages}</span>
						<button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
					</div>
				</div>
			)}
		</div>
	)

	const renderCustomerForm = () => (
		<div style={{ maxWidth: 600, margin: '0 auto' }}>
			<h2>{editingCustomer ? 'Edit Customer' : 'Create New Customer'}</h2>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
				<input
					type="text"
					placeholder="Customer Name"
					value={formData.name}
					onChange={(e) => setFormData({...formData, name: e.target.value})}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
				<input
					type="text"
					placeholder="Phone Number"
					value={formData.phone}
					onChange={(e) => setFormData({...formData, phone: e.target.value})}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
				<select 
					value={formData.status} 
					onChange={(e) => setFormData({...formData, status: e.target.value as any})}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
					<option value="blacklisted">Blacklisted</option>
					<option value="suspended">Suspended</option>
				</select>
				<div style={{ display: 'flex', gap: 8 }}>
					<button 
						onClick={editingCustomer ? () => handleUpdateCustomer(editingCustomer.id) : () => {}}
						style={{ padding: 12, background: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
					>
						{editingCustomer ? 'Update Customer' : 'Create Customer'}
					</button>
					<button 
						onClick={() => {
							setShowForm(false)
							setEditingCustomer(null)
						}}
						style={{ padding: 12, background: '#6b7280', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	)

	const renderCustomerDetails = () => (
		<div>
			{selectedCustomer && customerDetails ? (
				<div>
					<h3>Customer Details: {selectedCustomer.name}</h3>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
						<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
							<h4>Personal Information</h4>
							<p><strong>Name:</strong> {customerDetails.name}</p>
							<p><strong>Email:</strong> {customerDetails.email}</p>
							<p><strong>Phone:</strong> {customerDetails.phone || 'N/A'}</p>
							<p><strong>Status:</strong> {customerDetails.status}</p>
							<p><strong>Joined:</strong> {new Date(customerDetails.createdAt).toLocaleDateString()}</p>
						</div>
						<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
							<h4>Order Statistics</h4>
							<p><strong>Total Orders:</strong> {customerDetails.ordersCount || 0}</p>
							<p><strong>Total Spent:</strong> ₹{customerDetails.totalSpent || 0}</p>
							<p><strong>Average Order Value:</strong> ₹{customerDetails.avgOrderValue || 0}</p>
							<p><strong>Last Order:</strong> {customerDetails.lastOrderDate ? new Date(customerDetails.lastOrderDate).toLocaleDateString() : 'Never'}</p>
						</div>
						<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
							<h4>Loyalty Information</h4>
							<p><strong>Loyalty Points:</strong> {customerDetails.loyaltyPoints || 0}</p>
							<p><strong>Loyalty Tier:</strong> {customerDetails.loyaltyTier || 'Bronze'}</p>
							<p><strong>Lifetime Value:</strong> ₹{customerDetails.lifetimeValue || 0}</p>
						</div>
					</div>
					
					<h4>Recent Orders</h4>
					{customerOrders.length > 0 ? (
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr>
									<th align="left">Order ID</th>
									<th align="left">Date</th>
									<th align="left">Total</th>
									<th align="left">Status</th>
								</tr>
							</thead>
							<tbody>
								{customerOrders.map((order: any) => (
									<tr key={order.id} style={{ borderTop: '1px solid #1e2733' }}>
										<td>{order.orderNumber}</td>
										<td>{new Date(order.createdAt).toLocaleDateString()}</td>
										<td>₹{order.total}</td>
										<td>{order.status}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>No orders found for this customer.</p>
					)}
				</div>
			) : (
				<p>Select a customer to view details.</p>
			)}
		</div>
	)

	const renderSegments = () => (
		<div>
			<h3>Customer Segments</h3>
			{segmentsLoading && <p>Loading segments...</p>}
			{segments.map((segment: any) => (
				<div key={segment.type} style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8, marginBottom: 16 }}>
					<h4>{segment.name}</h4>
					<p><strong>Count:</strong> {segment.count}</p>
					<p><strong>Description:</strong> {segment.description}</p>
					<p><strong>Criteria:</strong> {segment.criteria}</p>
					{segment.customers && segment.customers.length > 0 && (
						<div>
							<p><strong>Top Customers:</strong></p>
							<ul>
								{segment.customers.slice(0, 5).map((customer: any) => (
									<li key={customer.id}>{customer.name} - ₹{customer.totalSpent}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			))}
		</div>
	)

	const renderLoyaltyManagement = () => (
		<div>
			<h3>Loyalty Points Management</h3>
			{selectedCustomer ? (
				<div>
					<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8, marginBottom: 20 }}>
						<h4>Selected Customer: {selectedCustomer.name}</h4>
						<p>Current Points: {customerDetails?.loyaltyPoints || 0}</p>
					</div>
					
					<div style={{ display: 'flex', gap: 20 }}>
						<div style={{ flex: 1, padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
							<h4>Add Points</h4>
							<input
								type="number"
								placeholder="Points to add"
								value={loyaltyPoints}
								onChange={(e) => setLoyaltyPoints(e.target.value)}
								style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white', width: '100%', marginBottom: 8 }}
							/>
							<input
								type="text"
								placeholder="Reason"
								value={loyaltyReason}
								onChange={(e) => setLoyaltyReason(e.target.value)}
								style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white', width: '100%', marginBottom: 8 }}
							/>
							<button 
								onClick={() => handleAddLoyaltyPoints(selectedCustomer.id)}
								style={{ padding: 8, background: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', width: '100%' }}
							>
								Add Points
							</button>
						</div>
						
						<div style={{ flex: 1, padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
							<h4>Redeem Points</h4>
							<input
								type="number"
								placeholder="Points to redeem"
								value={loyaltyPoints}
								onChange={(e) => setLoyaltyPoints(e.target.value)}
								style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white', width: '100%', marginBottom: 8 }}
							/>
							<input
								type="text"
								placeholder="Reason"
								value={loyaltyReason}
								onChange={(e) => setLoyaltyReason(e.target.value)}
								style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white', width: '100%', marginBottom: 8 }}
							/>
							<button 
								onClick={() => handleRedeemLoyaltyPoints(selectedCustomer.id)}
								style={{ padding: 8, background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', width: '100%' }}
							>
								Redeem Points
							</button>
						</div>
					</div>
				</div>
			) : (
				<p>Select a customer from the list to manage their loyalty points.</p>
			)}
		</div>
	)

	const renderExport = () => (
		<div>
			<h3>Export Customers</h3>
			<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
				<p>Export customer data in various formats:</p>
				<div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
					<button 
						onClick={() => handleExportCustomers('csv')}
						style={{ padding: 12, background: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
					>
						Export as CSV
					</button>
					<button 
						onClick={() => handleExportCustomers('excel')}
						style={{ padding: 12, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
					>
						Export as Excel
					</button>
				</div>
			</div>
		</div>
	)

	return (
		<div>
			<h1>Customer Management</h1>
			
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
			{activeTab === 'list' && renderCustomerList()}
			{activeTab === 'search' && (
				<div>
					<button 
						onClick={() => setShowForm(true)}
						style={{ padding: 12, background: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', marginBottom: 20 }}
					>
						Create New Customer
					</button>
					{showForm && renderCustomerForm()}
					{renderCustomerList()}
					{selectedCustomer && renderCustomerDetails()}
				</div>
			)}
			{activeTab === 'segments' && renderSegments()}
			{activeTab === 'loyalty' && renderLoyaltyManagement()}
			{activeTab === 'export' && renderExport()}
		</div>
	)
}