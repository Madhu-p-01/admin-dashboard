export interface PaginationMeta {
	page: number
	limit: number
	total: number
	totalPages: number
}

export interface PaginatedResult<T> {
	data: T[]
	meta: PaginationMeta
}

export interface ApiResponseSuccess<T> {
	success: true
	message?: string
	data: T
}

export interface ApiResponseError {
	success: false
	message: string
	error?: string
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError

// Products
export interface Product {
	product_id: string
	name: string
	description?: string
	price: number
	currency: string
	stock: number
	category_id?: string
	images?: string[]
	sizes?: string[]
	colors?: string[]
	rating?: number
	status?: string
	is_featured?: boolean
	created_at?: string
	updated_at?: string
}

// Orders (list item shape from backend mapping)
export interface OrderListItem {
	id: string
	orderNumber: string
	customer: {
		id: string
		name: string
		email: string
	}
	total: number
	currency: string
	paymentStatus: string
	fulfillmentStatus: string
	date: string
}

// Customers (list item)
export interface CustomerListItem {
	id: string
	name: string
	email: string
	phone: string
	ordersCount: number
	totalSpent: number
	loyaltyPoints: number
	status: string
	createdAt: string
}

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastActiveAt?: string;
};





