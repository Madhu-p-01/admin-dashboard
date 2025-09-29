export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiClientOptions {
	baseUrl?: string
	accessToken?: string | null
}

export class ApiClient {
	private readonly baseUrl: string
	private accessToken: string | null

	constructor(options?: ApiClientOptions) {
		this.baseUrl = options?.baseUrl ?? (import.meta.env.VITE_API_BASE_URL as string) ?? 'http://localhost:3000'
		this.accessToken = options?.accessToken ?? null
	}

	setToken(token: string | null) {
		this.accessToken = token
	}

	async request<T>(path: string, method: HttpMethod = 'GET', body?: unknown): Promise<T> {
		const headers: Record<string, string> = { 'Content-Type': 'application/json' }
		if (this.accessToken) headers['Authorization'] = `Bearer ${this.accessToken}`

		const res = await fetch(`${this.baseUrl}${path}`, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		})

		if (!res.ok) {
			const text = await res.text().catch(() => '')
			throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`)
		}

		return (await res.json()) as T
	}
}

export const api = new ApiClient()



