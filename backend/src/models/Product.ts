
export interface Product {
  product_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  category_id?: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  rating: number;
  status: ProductStatus;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductVariant {
  variant_id: string;
  product_id: string;
  size?: string;
  color?: string;
  price?: number;
  stock: number;
  sku?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  category_id: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  category: string;
  price: number;
  currency?: string;
  stock: number;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  status?: ProductStatus;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  currency?: string;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  status?: ProductStatus;
}

export interface ProductQueryParams {
  status?: ProductStatus;
  category?: string;
  page?: number;
  limit?: number;
  sort?: ProductSortOrder;
  search?: string;
  featured?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parent_id?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parent_id?: string;
}

export interface BulkInventoryUpdate {
  productId: string;
  stock: number;
}

export interface BulkPriceUpdate {
  productId: string;
  price: number;
}

export interface CreateVariantRequest {
  size?: string;
  color?: string;
  price?: number;
  stock: number;
  sku?: string;
}

export interface UpdateVariantRequest {
  size?: string;
  color?: string;
  price?: number;
  stock?: number;
  sku?: string;
}



export type ProductStatus = 'active' | 'inactive' | 'draft';
export type ProductSortOrder = 'latest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating' | 'stock';



export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductResponse extends ApiResponse<Product> {}
export interface ProductsResponse extends ApiResponse<PaginatedResponse<Product>> {}
export interface CategoryResponse extends ApiResponse<Category> {}
export interface CategoriesResponse extends ApiResponse<Category[]> {}
export interface VariantResponse extends ApiResponse<ProductVariant> {}
export interface VariantsResponse extends ApiResponse<ProductVariant[]> {}


export const PRODUCT_COLUMNS = [
  'product_id',
  'name',
  'description',
  'price',
  'currency',
  'stock',
  'category_id',
  'images',
  'sizes',
  'colors',
  'rating',
  'status',
  'is_featured',
  'created_at',
  'updated_at'
].join(',');

export const CATEGORY_COLUMNS = [
  'category_id',
  'name',
  'description',
  'parent_id',
  'created_at',
  'updated_at'
].join(',');

export const VARIANT_COLUMNS = [
  'variant_id',
  'product_id',
  'size',
  'color',
  'price',
  'stock',
  'sku',
  'created_at',
  'updated_at'
].join(',');
