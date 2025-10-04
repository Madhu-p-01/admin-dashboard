import { useEffect, useMemo, useState } from 'react'
import { api } from './api'

interface UseApiOptions<T> {
	path: string
	params?: Record<string, string | number | boolean | undefined>
	enabled?: boolean
	transform?: (data: any) => T
}

export function useApi<T>({ path, params, enabled = true, transform }: UseApiOptions<T>) {
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const queryString = useMemo(() => {
		if (!params) return ''
		const usp = new URLSearchParams()
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				usp.set(key, String(value))
			}
		})
		const qs = usp.toString()
		return qs ? `?${qs}` : ''
	}, [params])

	useEffect(() => {
		let cancelled = false
		async function run() {
			if (!enabled) return
			setLoading(true)
			setError(null)
			try {
				const res = await api.request<any>(`${path}${queryString}`, 'GET')
				const payload = transform ? transform(res) : res
				if (!cancelled) setData(payload)
			} catch (e: any) {
				if (!cancelled) setError(e?.message || 'Request failed')
			} finally {
				if (!cancelled) setLoading(false)
			}
		}
		run()
		return () => { cancelled = true }
	}, [path, queryString, enabled, transform])

	return { data, loading, error }
}



