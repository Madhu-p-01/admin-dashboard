import { useState, useCallback, useMemo } from 'react'
import { useApi } from '@/lib/useApi'
import { api } from '@/lib/api'
import type { ApiResponse, PaginatedResult, OrderListItem } from '@/types/api'

export default function Orders() {
	const [activeTab, setActiveTab] = useState('list')
	const [page, setPage] = useState(1)
	const [limit] = useState(10)
	const [search, setSearch] = useState('')
	const [status, setStatus] = useState('')
	const [paymentStatus, setPaymentStatus] = useState('')
	const [sort, setSort] = useState('date_desc')
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')
	const [minAmount, setMinAmount] = useState('')
	const [maxAmount, setMaxAmount] = useState('')

	// Order Details State
	const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(null)
	const [orderDetails, setOrderDetails] = useState<any>(null)
	const [orderNotes, setOrderNotes] = useState<any[]>([])

	// Bulk Actions State
	const [selectedOrders, setSelectedOrders] = useState<string[]>([])
	const [bulkAction, setBulkAction] = useState('')

	// Order Actions State
	const [showCancelModal, setShowCancelModal] = useState(false)
	const [showRefundModal, setShowRefundModal] = useState(false)
	const [showTrackingModal, setShowTrackingModal] = useState(false)
	const [showNoteModal, setShowNoteModal] = useState(false)
	const [cancelReason, setCancelReason] = useState('')
	const [refundAmount, setRefundAmount] = useState('')
	const [refundReason, setRefundReason] = useState('')
	const [trackingCarrier, setTrackingCarrier] = useState('')
	const [trackingNumber, setTrackingNumber] = useState('')
	const [estimatedDelivery, setEstimatedDelivery] = useState('')
	const [orderNote, setOrderNote] = useState('')

	const transform = useCallback((res: ApiResponse<{ data: OrderListItem[]; meta: any }>) => {
		if ((res as any).success === false) throw new Error((res as any).message)
		return { data: (res as any).data, meta: (res as any).meta }
	}, [])

	const { data, loading, error } = useApi<{ data: OrderListItem[]; meta: any }>({
		path: '/orders',
		params: { 
			page, 
			limit, 
			search: search || undefined,
			status: status || undefined,
			paymentStatus: paymentStatus || undefined,
			sort,
			date_from: dateFrom || undefined,
			date_to: dateTo || undefined,
			min_amount: minAmount || undefined,
			max_amount: maxAmount || undefined
		},
		transform
	})

	// Order Statistics
	const { data: statsData, loading: statsLoading } = useApi<any>({
		path: '/orders/stats/overview',
		transform: useCallback((res: ApiResponse<any>) => (res as any).data, [])
	})

	const orders = data?.data || []
	const meta = data?.meta
	const stats = statsData || {}
	const totalPages = useMemo(() => meta?.totalPages || 1, [meta])

	// Debug logging
	console.log('Orders Debug - Raw data:', data)
	console.log('Orders Debug - data?.data:', data?.data)
	console.log('Orders Debug - Final orders:', orders)
	console.log('Orders Debug - Meta:', meta)

	const tabs = [
		{ id: 'list', label: 'All Orders' },
		{ id: 'stats', label: 'Order Statistics' },
		{ id: 'bulk', label: 'Bulk Actions' },
		{ id: 'export', label: 'Export Orders' }
	]

	const handleGetOrderDetails = async (order: OrderListItem) => {
		try {
		const details = await api.request(`/orders/${order.id}`, 'GET')
		const notes = await api.request(`/orders/${order.id}/notes`, 'GET')
		setOrderDetails(details)
		setOrderNotes(notes as any[])
			setSelectedOrder(order)
		} catch (error) {
			console.error('Error fetching order details:', error)
		}
	}

	const handleUpdatePaymentStatus = async (orderId: string, newStatus: string) => {
		try {
			await api.request(`/orders/${orderId}/payment`, 'PUT', { paymentStatus: newStatus })
			window.location.reload()
		} catch (error) {
			console.error('Error updating payment status:', error)
		}
	}

	const handleUpdateFulfillmentStatus = async (orderId: string, newStatus: string) => {
		try {
			await api.request(`/orders/${orderId}/fulfillment`, 'PUT', { fulfillmentStatus: newStatus })
			window.location.reload()
		} catch (error) {
			console.error('Error updating fulfillment status:', error)
		}
	}

	const handleCancelOrder = async (orderId: string) => {
		try {
			await api.request(`/orders/${orderId}/cancel`, 'PUT', { reason: cancelReason })
			setShowCancelModal(false)
			setCancelReason('')
			window.location.reload()
		} catch (error) {
			console.error('Error cancelling order:', error)
		}
	}

	const handleRefundOrder = async (orderId: string) => {
		try {
			await api.request(`/orders/${orderId}/refund`, 'POST', { 
				amount: parseFloat(refundAmount),
				reason: refundReason
			})
			setShowRefundModal(false)
			setRefundAmount('')
			setRefundReason('')
			window.location.reload()
		} catch (error) {
			console.error('Error processing refund:', error)
		}
	}

	const handleUpdateTracking = async (orderId: string) => {
		try {
			await api.request(`/orders/${orderId}/tracking`, 'PUT', {
				carrier: trackingCarrier,
				trackingNumber: trackingNumber,
				estimatedDelivery: estimatedDelivery || undefined
			})
			setShowTrackingModal(false)
			setTrackingCarrier('')
			setTrackingNumber('')
			setEstimatedDelivery('')
			window.location.reload()
		} catch (error) {
			console.error('Error updating tracking:', error)
		}
	}

	const handleAddOrderNote = async (orderId: string) => {
		try {
			await api.request(`/orders/${orderId}/notes`, 'POST', { note: orderNote })
			setShowNoteModal(false)
			setOrderNote('')
			if (selectedOrder) {
				handleGetOrderDetails(selectedOrder)
			}
		} catch (error) {
			console.error('Error adding order note:', error)
		}
	}

	const handleBulkAction = async () => {
		if (selectedOrders.length === 0 || !bulkAction) return
		
		try {
			await api.request('/orders/bulk', 'POST', {
				action: bulkAction,
				orderIds: selectedOrders
			})
			setSelectedOrders([])
			setBulkAction('')
			window.location.reload()
		} catch (error) {
			console.error('Error performing bulk action:', error)
		}
	}

	const handleExportOrders = async (format: string) => {
		try {
			const response = await api.request(`/orders/export?format=${format}`, 'GET')
			console.log('Export response:', response)
			alert(`Orders exported as ${format.toUpperCase()}`)
		} catch (error) {
			console.error('Error exporting orders:', error)
		}
	}

	const handleFlagOrder = async (orderId: string, reason: string) => {
		try {
			await api.request(`/orders/${orderId}/flag`, 'POST', { reason })
			window.location.reload()
		} catch (error) {
			console.error('Error flagging order:', error)
		}
	}

	const handleArchiveOrder = async (orderId: string, archived: boolean) => {
		try {
			await api.request(`/orders/${orderId}/archive`, 'PUT', { archived })
			window.location.reload()
		} catch (error) {
			console.error('Error archiving order:', error)
		}
	}

	const renderOrderList = () => (
		<div>
			{/* Filters */}
			<div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
				<input
					type="text"
					placeholder="Search orders..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
				<select value={status} onChange={(e) => setStatus(e.target.value)}>
					<option value="">All Status</option>
					<option value="pending">Pending</option>
					<option value="confirmed">Confirmed</option>
					<option value="shipped">Shipped</option>
					<option value="delivered">Delivered</option>
					<option value="cancelled">Cancelled</option>
					<option value="returned">Returned</option>
				</select>
				<select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
					<option value="">All Payment Status</option>
					<option value="pending">Pending</option>
					<option value="paid">Paid</option>
					<option value="failed">Failed</option>
					<option value="refunded">Refunded</option>
				</select>
				<select value={sort} onChange={(e) => setSort(e.target.value)}>
					<option value="date_desc">Latest First</option>
					<option value="date_asc">Oldest First</option>
					<option value="amount_desc">Highest Amount</option>
					<option value="amount_asc">Lowest Amount</option>
					<option value="status">By Status</option>
				</select>
				<input
					type="date"
					placeholder="From Date"
					value={dateFrom}
					onChange={(e) => setDateFrom(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
				<input
					type="date"
					placeholder="To Date"
					value={dateTo}
					onChange={(e) => setDateTo(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
				<input
					type="number"
					placeholder="Min Amount"
					value={minAmount}
					onChange={(e) => setMinAmount(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white', width: 120 }}
				/>
				<input
					type="number"
					placeholder="Max Amount"
					value={maxAmount}
					onChange={(e) => setMaxAmount(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white', width: 120 }}
				/>
			</div>

			{loading && <p>Loading...</p>}
			{error && <p style={{ color: 'salmon' }}>Error: {error}</p>}
			{!loading && !error && orders.length === 0 && (
				<p>No orders found.</p>
			)}
			{!loading && !error && orders.length > 0 && (
				<div>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr>
								<th align="left">Order</th>
								<th align="left">Customer</th>
								<th align="left">Total</th>
								<th align="left">Payment</th>
								<th align="left">Fulfillment</th>
								<th align="left">Date</th>
								<th align="left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr key={order.id} style={{ borderTop: '1px solid #1e2733' }}>
									<td>{order.orderNumber}</td>
									<td>{order.customer.name} ({order.customer.email})</td>
									<td>{order.currency} {order.total}</td>
									<td>
										<select 
											value={order.paymentStatus} 
											onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
											style={{ padding: 4, background: '#0f1419', color: 'white', border: '1px solid #1e2733' }}
										>
											<option value="pending">Pending</option>
											<option value="paid">Paid</option>
											<option value="failed">Failed</option>
											<option value="refunded">Refunded</option>
										</select>
									</td>
									<td>
										<select 
											value={order.fulfillmentStatus} 
											onChange={(e) => handleUpdateFulfillmentStatus(order.id, e.target.value)}
											style={{ padding: 4, background: '#0f1419', color: 'white', border: '1px solid #1e2733' }}
										>
											<option value="pending">Pending</option>
											<option value="confirmed">Confirmed</option>
											<option value="shipped">Shipped</option>
											<option value="delivered">Delivered</option>
											<option value="cancelled">Cancelled</option>
											<option value="returned">Returned</option>
										</select>
									</td>
									<td>{order.date.split('T')[0]}</td>
									<td>
										<button 
											onClick={() => handleGetOrderDetails(order)}
											style={{ padding: 4, marginRight: 4, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4 }}
										>
											View
										</button>
										<button 
											onClick={() => setShowCancelModal(true)}
											style={{ padding: 4, marginRight: 4, background: '#ef4444', color: 'white', border: 'none', borderRadius: 4 }}
										>
											Cancel
										</button>
										<button 
											onClick={() => setShowRefundModal(true)}
											style={{ padding: 4, marginRight: 4, background: '#f59e0b', color: 'white', border: 'none', borderRadius: 4 }}
										>
											Refund
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

	const renderOrderDetails = () => (
		<div>
			{selectedOrder && orderDetails ? (
				<div>
					<h3>Order Details: {selectedOrder.orderNumber}</h3>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
						<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
							<h4>Order Information</h4>
							<p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
							<p><strong>Date:</strong> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
							<p><strong>Status:</strong> {orderDetails.status}</p>
							<p><strong>Payment Status:</strong> {orderDetails.paymentStatus}</p>
							<p><strong>Fulfillment Status:</strong> {orderDetails.fulfillmentStatus}</p>
						</div>
						<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
							<h4>Customer Information</h4>
							<p><strong>Name:</strong> {orderDetails.customer?.name}</p>
							<p><strong>Email:</strong> {orderDetails.customer?.email}</p>
							<p><strong>Phone:</strong> {orderDetails.customer?.phone || 'N/A'}</p>
						</div>
						<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
							<h4>Order Summary</h4>
							<p><strong>Subtotal:</strong> {orderDetails.currency} {orderDetails.subtotal}</p>
							<p><strong>Tax:</strong> {orderDetails.currency} {orderDetails.tax}</p>
							<p><strong>Shipping:</strong> {orderDetails.currency} {orderDetails.shipping}</p>
							<p><strong>Total:</strong> {orderDetails.currency} {orderDetails.total}</p>
						</div>
					</div>
					
					<h4>Order Items</h4>
					{orderDetails.items && orderDetails.items.length > 0 ? (
						<table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
							<thead>
								<tr>
									<th align="left">Product</th>
									<th align="left">Quantity</th>
									<th align="left">Price</th>
									<th align="left">Total</th>
								</tr>
							</thead>
							<tbody>
								{orderDetails.items.map((item: any, index: number) => (
									<tr key={index} style={{ borderTop: '1px solid #1e2733' }}>
										<td>{item.productName}</td>
										<td>{item.quantity}</td>
										<td>{item.currency} {item.price}</td>
										<td>{item.currency} {item.total}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>No items found</p>
					)}

					<h4>Order Notes</h4>
					<div style={{ marginBottom: 20 }}>
						<button 
							onClick={() => setShowNoteModal(true)}
							style={{ padding: 8, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4 }}
						>
							Add Note
						</button>
					</div>
					{orderNotes.length > 0 ? (
						<div>
							{orderNotes.map((note: any, index: number) => (
								<div key={index} style={{ padding: 10, border: '1px solid #1e2733', borderRadius: 4, marginBottom: 8 }}>
									<p><strong>Date:</strong> {new Date(note.createdAt).toLocaleString()}</p>
									<p><strong>Note:</strong> {note.note}</p>
								</div>
							))}
						</div>
					) : (
						<p>No notes found</p>
					)}
				</div>
			) : (
				<p>Select an order to view details</p>
			)}
		</div>
	)

	const renderOrderStats = () => (
		<div>
			<h3>Order Statistics</h3>
			{statsLoading ? (
				<p>Loading statistics...</p>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
					<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
						<h4>Total Orders</h4>
						<p style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.totalOrders || 0}</p>
					</div>
					<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
						<h4>Pending Orders</h4>
						<p style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.pendingOrders || 0}</p>
					</div>
					<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
						<h4>Completed Orders</h4>
						<p style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.completedOrders || 0}</p>
					</div>
					<div style={{ padding: 20, border: '1px solid #1e2733', borderRadius: 8 }}>
						<h4>Total Revenue</h4>
						<p style={{ fontSize: 24, fontWeight: 'bold' }}>₹{stats.totalRevenue || 0}</p>
					</div>
				</div>
			)}
		</div>
	)

	const renderBulkActions = () => (
		<div>
			<h3>Bulk Actions</h3>
			<div style={{ marginBottom: 20 }}>
				<select 
					value={bulkAction} 
					onChange={(e) => setBulkAction(e.target.value)}
					style={{ padding: 8, marginRight: 8, background: '#0f1419', color: 'white', border: '1px solid #1e2733' }}
				>
					<option value="">Select Action</option>
					<option value="mark_as_shipped">Mark as Shipped</option>
					<option value="mark_as_delivered">Mark as Delivered</option>
					<option value="mark_as_cancelled">Mark as Cancelled</option>
				</select>
				<button 
					onClick={handleBulkAction}
					disabled={!bulkAction || selectedOrders.length === 0}
					style={{ padding: 8, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4 }}
				>
					Execute Bulk Action
				</button>
			</div>
			<p>Selected Orders: {selectedOrders.length}</p>
		</div>
	)

	const renderExportOrders = () => (
		<div>
			<h3>Export Orders</h3>
			<div style={{ marginBottom: 20 }}>
				<button 
					onClick={() => handleExportOrders('csv')}
					style={{ padding: 8, marginRight: 8, background: '#10b981', color: 'white', border: 'none', borderRadius: 4 }}
				>
					Export as CSV
				</button>
				<button 
					onClick={() => handleExportOrders('excel')}
					style={{ padding: 8, background: '#10b981', color: 'white', border: 'none', borderRadius: 4 }}
				>
					Export as Excel
				</button>
			</div>
		</div>
	)

	return (
		<div>
			<h1>Orders</h1>
			
			{/* Tab Navigation */}
			<div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						style={{
							padding: 8,
							background: activeTab === tab.id ? '#3b82f6' : '#1e2733',
							color: 'white',
							border: 'none',
							borderRadius: 4
						}}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab Content */}
			{activeTab === 'list' && renderOrderList()}
			{activeTab === 'details' && renderOrderDetails()}
			{activeTab === 'stats' && renderOrderStats()}
			{activeTab === 'bulk' && renderBulkActions()}
			{activeTab === 'export' && renderExportOrders()}

			{/* Modals */}
			{showCancelModal && (
				<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div style={{ background: '#0f1419', padding: 20, borderRadius: 8, minWidth: 400 }}>
						<h3>Cancel Order</h3>
						<textarea
							placeholder="Cancellation reason..."
							value={cancelReason}
							onChange={(e) => setCancelReason(e.target.value)}
							style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
						/>
						<div style={{ display: 'flex', gap: 8 }}>
							<button onClick={() => handleCancelOrder(selectedOrder?.id || '')} style={{ padding: 8, background: '#ef4444', color: 'white', border: 'none', borderRadius: 4 }}>Cancel Order</button>
							<button onClick={() => setShowCancelModal(false)} style={{ padding: 8, background: '#6b7280', color: 'white', border: 'none', borderRadius: 4 }}>Close</button>
						</div>
					</div>
				</div>
			)}

			{showRefundModal && (
				<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div style={{ background: '#0f1419', padding: 20, borderRadius: 8, minWidth: 400 }}>
						<h3>Process Refund</h3>
						<input
							type="number"
							placeholder="Refund amount..."
							value={refundAmount}
							onChange={(e) => setRefundAmount(e.target.value)}
							style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
						/>
						<textarea
							placeholder="Refund reason..."
							value={refundReason}
							onChange={(e) => setRefundReason(e.target.value)}
							style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
						/>
						<div style={{ display: 'flex', gap: 8 }}>
							<button onClick={() => handleRefundOrder(selectedOrder?.id || '')} style={{ padding: 8, background: '#f59e0b', color: 'white', border: 'none', borderRadius: 4 }}>Process Refund</button>
							<button onClick={() => setShowRefundModal(false)} style={{ padding: 8, background: '#6b7280', color: 'white', border: 'none', borderRadius: 4 }}>Close</button>
						</div>
					</div>
				</div>
			)}

			{showTrackingModal && (
				<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div style={{ background: '#0f1419', padding: 20, borderRadius: 8, minWidth: 400 }}>
						<h3>Update Tracking</h3>
						<input
							type="text"
							placeholder="Carrier..."
							value={trackingCarrier}
							onChange={(e) => setTrackingCarrier(e.target.value)}
							style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
						/>
						<input
							type="text"
							placeholder="Tracking number..."
							value={trackingNumber}
							onChange={(e) => setTrackingNumber(e.target.value)}
							style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
						/>
						<input
							type="datetime-local"
							placeholder="Estimated delivery..."
							value={estimatedDelivery}
							onChange={(e) => setEstimatedDelivery(e.target.value)}
							style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
						/>
						<div style={{ display: 'flex', gap: 8 }}>
							<button onClick={() => handleUpdateTracking(selectedOrder?.id || '')} style={{ padding: 8, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4 }}>Update Tracking</button>
							<button onClick={() => setShowTrackingModal(false)} style={{ padding: 8, background: '#6b7280', color: 'white', border: 'none', borderRadius: 4 }}>Close</button>
						</div>
					</div>
				</div>
			)}

			{showNoteModal && (
				<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div style={{ background: '#0f1419', padding: 20, borderRadius: 8, minWidth: 400 }}>
						<h3>Add Order Note</h3>
						<textarea
							placeholder="Order note..."
							value={orderNote}
							onChange={(e) => setOrderNote(e.target.value)}
							style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
						/>
						<div style={{ display: 'flex', gap: 8 }}>
							<button onClick={() => handleAddOrderNote(selectedOrder?.id || '')} style={{ padding: 8, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4 }}>Add Note</button>
							<button onClick={() => setShowNoteModal(false)} style={{ padding: 8, background: '#6b7280', color: 'white', border: 'none', borderRadius: 4 }}>Close</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}