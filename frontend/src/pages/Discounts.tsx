import { useState, useCallback, useMemo } from 'react'
import { useApi } from '@/lib/useApi'
import { api } from '@/lib/api'
import type { ApiResponse, PaginatedResult, Discount } from '@/types/api'

export default function Discounts() {
	const [activeTab, setActiveTab] = useState('list')
	const [page, setPage] = useState(1)
	const [limit] = useState(10)
	const [search, setSearch] = useState('')
	const [status, setStatus] = useState('')
	const [type, setType] = useState('')
	const [active, setActive] = useState('')
	const [expired, setExpired] = useState('')

	// Create/Edit Discount State
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
	const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
	const [discountForm, setDiscountForm] = useState({
		code: '',
		type: 'percentage',
		value: '',
		minPurchase: '',
		maxDiscount: '',
		startDate: '',
		endDate: '',
		usageLimit: '',
		perCustomerLimit: '',
		applicableCategories: [] as string[],
		applicableProducts: [] as string[],
		status: 'active'
	})

	// Bulk Actions State
	const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([])
	const [bulkAction, setBulkAction] = useState('')

	// Auto Discount State
	const [showAutoModal, setShowAutoModal] = useState(false)
	const [autoDiscountForm, setAutoDiscountForm] = useState({
		rule: '',
		category: '',
		startDate: '',
		endDate: '',
		value: '',
		type: 'percentage'
	})

	// Available Options State
	const [availableOptions, setAvailableOptions] = useState<any>(null)

	const transform = useCallback((res: ApiResponse<{ data: PaginatedResult<Discount> }>) => {
		if ((res as any).success === false) throw new Error((res as any).message)
		return (res as any).data
	}, [])

	const { data, loading, error } = useApi<{ data: PaginatedResult<Discount> }>({
		path: '/discounts',
		params: { 
			page, 
			limit, 
			search: search || undefined,
			status: status || undefined,
			type: type || undefined,
			active: active || undefined,
			expired: expired || undefined
		},
		transform
	})

	// Get Available Options
	const { data: optionsData } = useApi<any>({
		path: '/discounts/options',
		transform: useCallback((res: ApiResponse<any>) => (res as any).data, [])
	})

	const discounts = data?.data || []
	const meta = data?.data.meta
	const totalPages = useMemo(() => meta?.totalPages || 1, [meta])

	const tabs = [
		{ id: 'list', label: 'All Discounts' },
		{ id: 'create', label: 'Create Discount' },
		{ id: 'auto', label: 'Auto Discounts' },
		{ id: 'bulk', label: 'Bulk Actions' },
		{ id: 'export', label: 'Export Discounts' }
	]

	const handleCreateDiscount = async () => {
		try {
			await api.request('/discounts', 'POST', discountForm)
			setShowCreateModal(false)
			resetDiscountForm()
			window.location.reload()
		} catch (error) {
			console.error('Error creating discount:', error)
		}
	}

	const handleUpdateDiscount = async () => {
		if (!selectedDiscount) return
		
		try {
			await api.request(`/discounts/${selectedDiscount.id}`, 'PUT', discountForm)
			setShowEditModal(false)
			resetDiscountForm()
			window.location.reload()
		} catch (error) {
			console.error('Error updating discount:', error)
		}
	}

	const handleDeleteDiscount = async (discountId: string) => {
		if (!confirm('Are you sure you want to delete this discount?')) return
		
		try {
			await api.request(`/discounts/${discountId}`, 'DELETE')
			window.location.reload()
		} catch (error) {
			console.error('Error deleting discount:', error)
		}
	}

	const handleUpdateDiscountStatus = async (discountId: string, newStatus: string) => {
		try {
			await api.request(`/discounts/${discountId}/status`, 'PUT', { status: newStatus })
			window.location.reload()
		} catch (error) {
			console.error('Error updating discount status:', error)
		}
	}

	const handleGetDiscountUsage = async (discountId: string) => {
		try {
			const usage = await api.request(`/discounts/${discountId}/usage`, 'GET')
			console.log('Discount usage:', usage)
			alert(`Usage data: ${JSON.stringify(usage, null, 2)}`)
		} catch (error) {
			console.error('Error fetching discount usage:', error)
		}
	}

	const handleBulkAction = async () => {
		if (selectedDiscounts.length === 0 || !bulkAction) return
		
		try {
			if (bulkAction === 'delete') {
				for (const discountId of selectedDiscounts) {
					await api.request(`/discounts/${discountId}`, 'DELETE')
				}
			} else if (bulkAction === 'activate') {
				for (const discountId of selectedDiscounts) {
					await api.request(`/discounts/${discountId}/status`, 'PUT', { status: 'active' })
				}
			} else if (bulkAction === 'deactivate') {
				for (const discountId of selectedDiscounts) {
					await api.request(`/discounts/${discountId}/status`, 'PUT', { status: 'inactive' })
				}
			}
			setSelectedDiscounts([])
			setBulkAction('')
			window.location.reload()
		} catch (error) {
			console.error('Error performing bulk action:', error)
		}
	}

	const handleCreateAutoDiscount = async () => {
		try {
			await api.request('/discounts/auto', 'POST', autoDiscountForm)
			setShowAutoModal(false)
			resetAutoDiscountForm()
			window.location.reload()
		} catch (error) {
			console.error('Error creating auto discount:', error)
		}
	}

	const handleExportDiscounts = async (format: string) => {
		try {
			const response = await api.request(`/discounts/export?format=${format}`, 'GET')
			console.log('Export response:', response)
			alert(`Discounts exported as ${format.toUpperCase()}`)
		} catch (error) {
			console.error('Error exporting discounts:', error)
		}
	}

	const resetDiscountForm = () => {
		setDiscountForm({
			code: '',
			type: 'percentage',
			value: '',
			minPurchase: '',
			maxDiscount: '',
			startDate: '',
			endDate: '',
			usageLimit: '',
			perCustomerLimit: '',
			applicableCategories: [],
			applicableProducts: [],
			status: 'active'
		})
	}

	const resetAutoDiscountForm = () => {
		setAutoDiscountForm({
			rule: '',
			category: '',
			startDate: '',
			endDate: '',
			value: '',
			type: 'percentage'
		})
	}

	const openEditModal = (discount: Discount) => {
		setSelectedDiscount(discount)
		setDiscountForm({
			code: discount.code,
			type: discount.type,
			value: discount.value.toString(),
			minPurchase: discount.minPurchase?.toString() || '',
			maxDiscount: discount.maxDiscount?.toString() || '',
			startDate: discount.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '',
			endDate: discount.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : '',
			usageLimit: discount.usageLimit?.toString() || '',
			perCustomerLimit: discount.perCustomerLimit?.toString() || '',
			applicableCategories: discount.applicableCategories || [],
			applicableProducts: discount.applicableProducts || [],
			status: discount.isActive ? 'active' : 'inactive'
		})
		setShowEditModal(true)
	}

	const renderDiscountList = () => (
		<div>
			{/* Filters */}
			<div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
				<input
					type="text"
					placeholder="Search discounts..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
				<select value={status} onChange={(e) => setStatus(e.target.value)}>
					<option value="">All Status</option>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
				</select>
				<select value={type} onChange={(e) => setType(e.target.value)}>
					<option value="">All Types</option>
					<option value="percentage">Percentage</option>
					<option value="fixed_amount">Fixed Amount</option>
					<option value="free_shipping">Free Shipping</option>
				</select>
				<select value={active} onChange={(e) => setActive(e.target.value)}>
					<option value="">All Active Status</option>
					<option value="true">Active</option>
					<option value="false">Inactive</option>
				</select>
				<select value={expired} onChange={(e) => setExpired(e.target.value)}>
					<option value="">All Expiry Status</option>
					<option value="true">Expired</option>
					<option value="false">Not Expired</option>
				</select>
			</div>

			{loading && <p>Loading...</p>}
			{error && <p style={{ color: 'salmon' }}>Error: {error}</p>}
			{!loading && !error && discounts.length === 0 && (
				<p>No discounts found. Create your first discount!</p>
			)}
			{!loading && !error && discounts.length > 0 && (
				<div>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr>
								<th align="left">Code</th>
								<th align="left">Type</th>
								<th align="left">Value</th>
								<th align="left">Usage</th>
								<th align="left">Status</th>
								<th align="left">Expires</th>
								<th align="left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{discounts.map((discount) => (
								<tr key={discount.id} style={{ borderTop: '1px solid #1e2733' }}>
									<td>{discount.code}</td>
									<td>{discount.type}</td>
									<td>{discount.value}</td>
									<td>{discount.usageCount || 0} / {discount.usageLimit || '∞'}</td>
									<td>
										<select 
											value={discount.isActive ? 'active' : 'inactive'} 
											onChange={(e) => handleUpdateDiscountStatus(discount.id, e.target.value)}
											style={{ padding: 4, background: '#0f1419', color: 'white', border: '1px solid #1e2733' }}
										>
											<option value="active">Active</option>
											<option value="inactive">Inactive</option>
										</select>
									</td>
									<td>{discount.expiresAt ? new Date(discount.expiresAt).toLocaleDateString() : 'Never'}</td>
									<td>
										<button 
											onClick={() => openEditModal(discount)}
											style={{ padding: 4, marginRight: 4, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4 }}
										>
											Edit
										</button>
										<button 
											onClick={() => handleGetDiscountUsage(discount.id)}
											style={{ padding: 4, marginRight: 4, background: '#10b981', color: 'white', border: 'none', borderRadius: 4 }}
										>
											Usage
										</button>
										<button 
											onClick={() => handleDeleteDiscount(discount.id)}
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

	const renderCreateDiscount = () => (
		<div>
			<h3>Create New Discount</h3>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
				<div>
					<label>Discount Code</label>
					<input
						type="text"
						value={discountForm.code}
						onChange={(e) => setDiscountForm({...discountForm, code: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>Type</label>
					<select 
						value={discountForm.type} 
						onChange={(e) => setDiscountForm({...discountForm, type: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					>
						<option value="percentage">Percentage</option>
						<option value="fixed_amount">Fixed Amount</option>
						<option value="free_shipping">Free Shipping</option>
					</select>
				</div>
				<div>
					<label>Value</label>
					<input
						type="number"
						value={discountForm.value}
						onChange={(e) => setDiscountForm({...discountForm, value: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>Minimum Purchase</label>
					<input
						type="number"
						value={discountForm.minPurchase}
						onChange={(e) => setDiscountForm({...discountForm, minPurchase: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>Maximum Discount</label>
					<input
						type="number"
						value={discountForm.maxDiscount}
						onChange={(e) => setDiscountForm({...discountForm, maxDiscount: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>Start Date</label>
					<input
						type="date"
						value={discountForm.startDate}
						onChange={(e) => setDiscountForm({...discountForm, startDate: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>End Date</label>
					<input
						type="date"
						value={discountForm.endDate}
						onChange={(e) => setDiscountForm({...discountForm, endDate: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>Usage Limit</label>
					<input
						type="number"
						value={discountForm.usageLimit}
						onChange={(e) => setDiscountForm({...discountForm, usageLimit: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>Per Customer Limit</label>
					<input
						type="number"
						value={discountForm.perCustomerLimit}
						onChange={(e) => setDiscountForm({...discountForm, perCustomerLimit: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>Status</label>
					<select 
						value={discountForm.status} 
						onChange={(e) => setDiscountForm({...discountForm, status: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>
			<button 
				onClick={handleCreateDiscount}
				style={{ padding: 12, background: '#10b981', color: 'white', border: 'none', borderRadius: 4 }}
			>
				Create Discount
			</button>
		</div>
	)

	const renderAutoDiscounts = () => (
		<div>
			<h3>Auto Discounts</h3>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
				<div>
					<label>Rule</label>
					<input
						type="text"
						value={autoDiscountForm.rule}
						onChange={(e) => setAutoDiscountForm({...autoDiscountForm, rule: e.target.value})}
						placeholder="e.g., Buy 2 get 1 free"
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>Category</label>
					<input
						type="text"
						value={autoDiscountForm.category}
						onChange={(e) => setAutoDiscountForm({...autoDiscountForm, category: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>Start Date</label>
					<input
						type="date"
						value={autoDiscountForm.startDate}
						onChange={(e) => setAutoDiscountForm({...autoDiscountForm, startDate: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>End Date</label>
					<input
						type="date"
						value={autoDiscountForm.endDate}
						onChange={(e) => setAutoDiscountForm({...autoDiscountForm, endDate: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>Value</label>
					<input
						type="number"
						value={autoDiscountForm.value}
						onChange={(e) => setAutoDiscountForm({...autoDiscountForm, value: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					/>
				</div>
				<div>
					<label>Type</label>
					<select 
						value={autoDiscountForm.type} 
						onChange={(e) => setAutoDiscountForm({...autoDiscountForm, type: e.target.value})}
						style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
					>
						<option value="percentage">Percentage</option>
						<option value="fixed_amount">Fixed Amount</option>
						<option value="free_shipping">Free Shipping</option>
					</select>
				</div>
			</div>
			<button 
				onClick={handleCreateAutoDiscount}
				style={{ padding: 12, background: '#10b981', color: 'white', border: 'none', borderRadius: 4 }}
			>
				Create Auto Discount
			</button>
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
					<option value="activate">Activate Selected</option>
					<option value="deactivate">Deactivate Selected</option>
					<option value="delete">Delete Selected</option>
				</select>
				<button 
					onClick={handleBulkAction}
					disabled={!bulkAction || selectedDiscounts.length === 0}
					style={{ padding: 8, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4 }}
				>
					Execute Bulk Action
				</button>
			</div>
			<p>Selected Discounts: {selectedDiscounts.length}</p>
		</div>
	)

	const renderExportDiscounts = () => (
		<div>
			<h3>Export Discounts</h3>
			<div style={{ marginBottom: 20 }}>
				<button 
					onClick={() => handleExportDiscounts('csv')}
					style={{ padding: 8, marginRight: 8, background: '#10b981', color: 'white', border: 'none', borderRadius: 4 }}
				>
					Export as CSV
				</button>
				<button 
					onClick={() => handleExportDiscounts('excel')}
					style={{ padding: 8, background: '#10b981', color: 'white', border: 'none', borderRadius: 4 }}
				>
					Export as Excel
				</button>
			</div>
		</div>
	)

	return (
		<div>
			<h1>Discounts</h1>
			
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
			{activeTab === 'list' && renderDiscountList()}
			{activeTab === 'create' && renderCreateDiscount()}
			{activeTab === 'auto' && renderAutoDiscounts()}
			{activeTab === 'bulk' && renderBulkActions()}
			{activeTab === 'export' && renderExportDiscounts()}

			{/* Edit Modal */}
			{showEditModal && selectedDiscount && (
				<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div style={{ background: '#0f1419', padding: 20, borderRadius: 8, minWidth: 600, maxHeight: '80vh', overflow: 'auto' }}>
						<h3>Edit Discount: {selectedDiscount.code}</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 15 }}>
							<div>
								<label>Discount Code</label>
								<input
									type="text"
									value={discountForm.code}
									onChange={(e) => setDiscountForm({...discountForm, code: e.target.value})}
									style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
								/>
							</div>
							<div>
								<label>Type</label>
								<select 
									value={discountForm.type} 
									onChange={(e) => setDiscountForm({...discountForm, type: e.target.value})}
									style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
								>
									<option value="percentage">Percentage</option>
									<option value="fixed_amount">Fixed Amount</option>
									<option value="free_shipping">Free Shipping</option>
								</select>
							</div>
							<div>
								<label>Value</label>
								<input
									type="number"
									value={discountForm.value}
									onChange={(e) => setDiscountForm({...discountForm, value: e.target.value})}
									style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
								/>
							</div>
							<div>
								<label>Status</label>
								<select 
									value={discountForm.status} 
									onChange={(e) => setDiscountForm({...discountForm, status: e.target.value})}
									style={{ width: '100%', padding: 8, marginBottom: 12, background: '#1e2733', color: 'white', border: '1px solid #1e2733' }}
								>
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
								</select>
							</div>
						</div>
						<div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
							<button onClick={handleUpdateDiscount} style={{ padding: 8, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4 }}>Update Discount</button>
							<button onClick={() => setShowEditModal(false)} style={{ padding: 8, background: '#6b7280', color: 'white', border: 'none', borderRadius: 4 }}>Cancel</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}