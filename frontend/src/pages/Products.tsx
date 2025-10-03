import { useMemo, useState, useCallback } from 'react'
import { useApi } from '@/lib/useApi'
import { api } from '@/lib/api'
import type { ApiResponse, PaginatedResult, Product } from '@/types/api'

export default function Products() {
	const [activeTab, setActiveTab] = useState('list')
	const [page, setPage] = useState(1)
	const [limit] = useState(10)
	const [search, setSearch] = useState('')
	const [status, setStatus] = useState('')
	const [category, setCategory] = useState('')
	const [sort, setSort] = useState('latest')
	const [featured, setFeatured] = useState<boolean | undefined>(undefined)

	// Product Form State
	const [showForm, setShowForm] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		category: '',
		price: 0,
		currency: 'INR',
		stock: 0,
		status: 'active' as 'active' | 'inactive' | 'draft',
		sizes: [] as string[],
		colors: [] as string[],
		images: [] as string[]
	})

	const transform = useCallback((res: ApiResponse<{ data: PaginatedResult<Product> }>) => {
		if ((res as any).success === false) throw new Error((res as any).message)
		return (res as any).data
	}, [])

	const { data, loading, error } = useApi<{ data: PaginatedResult<Product> }>({
		path: '/api/v1/admin/products',
		params: { 
			page, 
			limit, 
			search: search || undefined,
			status: status || undefined,
			category: category || undefined,
			sort,
			featured: featured !== undefined ? featured : undefined
		},
		transform
	})

	// Categories
	const { data: categoriesData, loading: categoriesLoading } = useApi<any>({
		path: '/api/v1/admin/products/categories',
		transform: useCallback((res: ApiResponse<any>) => (res as any).data, [])
	})

	const products = data?.data?.data || []
	const meta = data?.data?.meta
	const categories = categoriesData || []
	const totalPages = useMemo(() => meta?.totalPages || 1, [meta])

	const tabs = [
		{ id: 'list', label: 'All Products' },
		{ id: 'create', label: 'Create Product' },
		{ id: 'categories', label: 'Categories' },
		{ id: 'inventory', label: 'Inventory' },
		{ id: 'pricing', label: 'Pricing' }
	]

	const handleCreateProduct = async () => {
		try {
			await api.request('/api/v1/admin/products', 'POST', formData)
			setShowForm(false)
			setFormData({
				name: '',
				description: '',
				category: '',
				price: 0,
				currency: 'INR',
				stock: 0,
				status: 'active',
				sizes: [],
				colors: [],
				images: []
			})
			// Refresh the list
			window.location.reload()
		} catch (error) {
			console.error('Error creating product:', error)
		}
	}

	const handleUpdateProduct = async (id: string) => {
		try {
			await api.request(`/api/v1/admin/products/${id}`, 'PUT', formData)
			setShowForm(false)
			setEditingProduct(null)
			// Refresh the list
			window.location.reload()
		} catch (error) {
			console.error('Error updating product:', error)
		}
	}

	const handleDeleteProduct = async (id: string) => {
		if (confirm('Are you sure you want to delete this product?')) {
			try {
				await api.request(`/api/v1/admin/products/${id}`, 'DELETE')
				// Refresh the list
				window.location.reload()
			} catch (error) {
				console.error('Error deleting product:', error)
			}
		}
	}

	const handleUpdateStatus = async (id: string, newStatus: string) => {
		try {
			await api.request(`/api/v1/admin/products/${id}/status`, 'PUT', { status: newStatus })
			// Refresh the list
			window.location.reload()
		} catch (error) {
			console.error('Error updating status:', error)
		}
	}

	const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
		try {
			await api.request(`/api/v1/admin/products/${id}/feature`, 'PUT', { isFeatured })
			// Refresh the list
			window.location.reload()
		} catch (error) {
			console.error('Error toggling featured:', error)
		}
	}

	const handleUpdateInventory = async (id: string, stock: number) => {
		try {
			await api.request(`/api/v1/admin/products/${id}/inventory`, 'PUT', { stock })
			// Refresh the list
			window.location.reload()
		} catch (error) {
			console.error('Error updating inventory:', error)
		}
	}

	const handleUpdatePrice = async (id: string, price: number) => {
		try {
			await api.request(`/api/v1/admin/products/${id}/price`, 'PUT', { price })
			// Refresh the list
			window.location.reload()
		} catch (error) {
			console.error('Error updating price:', error)
		}
	}

	const renderProductList = () => (
		<div>
			{/* Filters */}
			<div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
				<input
					type="text"
					placeholder="Search products..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
				<select value={status} onChange={(e) => setStatus(e.target.value)}>
					<option value="">All Status</option>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
					<option value="draft">Draft</option>
				</select>
				<select value={category} onChange={(e) => setCategory(e.target.value)}>
					<option value="">All Categories</option>
					{categories.map((cat: any) => (
						<option key={cat.id} value={cat.name}>{cat.name}</option>
					))}
				</select>
				<select value={sort} onChange={(e) => setSort(e.target.value)}>
					<option value="latest">Latest</option>
					<option value="oldest">Oldest</option>
					<option value="price_asc">Price Low to High</option>
					<option value="price_desc">Price High to Low</option>
					<option value="stock">Stock</option>
				</select>
				<select value={featured === undefined ? '' : featured.toString()} onChange={(e) => setFeatured(e.target.value === '' ? undefined : e.target.value === 'true')}>
					<option value="">All Products</option>
					<option value="true">Featured Only</option>
					<option value="false">Not Featured</option>
				</select>
			</div>

			{loading && <p>Loading...</p>}
			{error && <p style={{ color: 'salmon' }}>Error: {error}</p>}
			{!loading && !error && products.length === 0 && (
				<p>No products found. Create your first product!</p>
			)}
			{!loading && !error && products.length > 0 && (
				<div>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr>
								<th align="left">Name</th>
								<th align="left">Category</th>
								<th align="left">Price</th>
								<th align="left">Stock</th>
								<th align="left">Status</th>
								<th align="left">Featured</th>
								<th align="left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr key={product.product_id} style={{ borderTop: '1px solid #1e2733' }}>
									<td>{product.name}</td>
									<td>{product.category_id || 'N/A'}</td>
									<td>{product.currency} {product.price}</td>
									<td>{product.stock}</td>
									<td>
										<select 
											value={product.status || 'active'} 
											onChange={(e) => handleUpdateStatus(product.product_id, e.target.value)}
											style={{ padding: 4, background: '#0f1419', color: 'white', border: '1px solid #1e2733' }}
										>
											<option value="active">Active</option>
											<option value="inactive">Inactive</option>
											<option value="draft">Draft</option>
										</select>
									</td>
									<td>
										<button 
											onClick={() => handleToggleFeatured(product.product_id, !product.is_featured)}
											style={{ 
												padding: 4, 
												background: product.is_featured ? '#10b981' : '#6b7280',
												color: 'white',
												border: 'none',
												borderRadius: 4
											}}
										>
											{product.is_featured ? 'Featured' : 'Not Featured'}
										</button>
									</td>
									<td>
										<button 
											onClick={() => {
												setEditingProduct(product)
												setFormData({
													name: product.name,
													description: product.description || '',
													category: product.category_id || '',
													price: product.price,
													currency: product.currency || 'INR',
													stock: product.stock,
													status: (product.status as 'active' | 'inactive' | 'draft') || 'active',
													sizes: product.sizes || [],
													colors: product.colors || [],
													images: product.images || []
												})
												setShowForm(true)
											}}
											style={{ padding: 4, marginRight: 4, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4 }}
										>
											Edit
										</button>
										<button 
											onClick={() => handleDeleteProduct(product.product_id)}
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

	const renderProductForm = () => (
		<div style={{ maxWidth: 600, margin: '0 auto' }}>
			<h2>{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
				<input
					type="text"
					placeholder="Product Name"
					value={formData.name}
					onChange={(e) => setFormData({...formData, name: e.target.value})}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
				<textarea
					placeholder="Description"
					value={formData.description}
					onChange={(e) => setFormData({...formData, description: e.target.value})}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white', minHeight: 80 }}
				/>
				<select 
					value={formData.category} 
					onChange={(e) => setFormData({...formData, category: e.target.value})}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				>
					<option value="">Select Category</option>
					{categories.map((cat: any) => (
						<option key={cat.id} value={cat.name}>{cat.name}</option>
					))}
				</select>
				<div style={{ display: 'flex', gap: 8 }}>
					<input
						type="number"
						placeholder="Price"
						value={formData.price}
						onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
						style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white', flex: 1 }}
					/>
					<select 
						value={formData.currency} 
						onChange={(e) => setFormData({...formData, currency: e.target.value})}
						style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
					>
						<option value="INR">INR</option>
						<option value="USD">USD</option>
						<option value="EUR">EUR</option>
					</select>
				</div>
				<input
					type="number"
					placeholder="Stock"
					value={formData.stock}
					onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
				<select 
					value={formData.status} 
					onChange={(e) => setFormData({...formData, status: e.target.value as any})}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
					<option value="draft">Draft</option>
				</select>
				<div style={{ display: 'flex', gap: 8 }}>
					<button 
						onClick={editingProduct ? () => handleUpdateProduct(editingProduct.product_id) : handleCreateProduct}
						style={{ padding: 12, background: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
					>
						{editingProduct ? 'Update Product' : 'Create Product'}
					</button>
					<button 
						onClick={() => {
							setShowForm(false)
							setEditingProduct(null)
						}}
						style={{ padding: 12, background: '#6b7280', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	)

	const renderCategories = () => (
		<div>
			<h3>Categories</h3>
			{categoriesLoading && <p>Loading categories...</p>}
			{categories.map((cat: any) => (
				<div key={cat.id} style={{ padding: 10, border: '1px solid #1e2733', borderRadius: 4, marginBottom: 8 }}>
					<p><strong>{cat.name}</strong></p>
					<p>{cat.description || 'No description'}</p>
					<p>Products: {cat.productCount || 0}</p>
				</div>
			))}
		</div>
	)

	const renderInventory = () => (
		<div>
			<h3>Inventory Management</h3>
			{products.map((product) => (
				<div key={product.product_id} style={{ padding: 10, border: '1px solid #1e2733', borderRadius: 4, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<div>
						<p><strong>{product.name}</strong></p>
						<p>Current Stock: {product.stock}</p>
					</div>
					<div style={{ display: 'flex', gap: 8 }}>
						<input
							type="number"
							placeholder="New Stock"
							style={{ padding: 4, width: 100, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
							onChange={(e) => {
								const newStock = parseInt(e.target.value) || 0
								if (e.target.value && newStock !== product.stock) {
									handleUpdateInventory(product.product_id, newStock)
								}
							}}
						/>
					</div>
				</div>
			))}
		</div>
	)

	const renderPricing = () => (
		<div>
			<h3>Pricing Management</h3>
			{products.map((product) => (
				<div key={product.product_id} style={{ padding: 10, border: '1px solid #1e2733', borderRadius: 4, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<div>
						<p><strong>{product.name}</strong></p>
						<p>Current Price: {product.currency} {product.price}</p>
					</div>
					<div style={{ display: 'flex', gap: 8 }}>
						<input
							type="number"
							placeholder="New Price"
							style={{ padding: 4, width: 100, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
							onChange={(e) => {
								const newPrice = parseFloat(e.target.value) || 0
								if (e.target.value && newPrice !== product.price) {
									handleUpdatePrice(product.product_id, newPrice)
								}
							}}
						/>
					</div>
				</div>
			))}
		</div>
	)

	return (
		<div>
			<h1>Products Management</h1>
			
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
			{activeTab === 'list' && renderProductList()}
			{activeTab === 'create' && (showForm ? renderProductForm() : (
				<div>
					<button 
						onClick={() => setShowForm(true)}
						style={{ padding: 12, background: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', marginBottom: 20 }}
					>
						Create New Product
					</button>
					{renderProductList()}
				</div>
			))}
			{activeTab === 'categories' && renderCategories()}
			{activeTab === 'inventory' && renderInventory()}
			{activeTab === 'pricing' && renderPricing()}
		</div>
	)
}