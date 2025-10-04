import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'

export default function TestApi() {
	const [result, setResult] = useState<any>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const testApi = async () => {
		setLoading(true)
		setError(null)
		try {
			console.log('Testing API call...')
			console.log('Base URL:', import.meta.env.VITE_API_BASE_URL)
			
			const response = await api.request('/api/v1/admin/products')
			console.log('API Response:', response)
			setResult(response)
		} catch (err: any) {
			console.error('API Error:', err)
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		testApi()
	}, [])

	// Also test the useApi hook
	const { data: apiData, loading: apiLoading, error: apiError } = useApi({
		path: '/api/v1/admin/products',
		transform: (res: any) => {
			console.log('TestApi useApi response:', res)
			return res
		}
	})

	console.log('TestApi useApi result:', { apiData, apiLoading, apiError })
	console.log('TestApi - apiData structure:', apiData)
	console.log('TestApi - apiData?.data:', apiData?.data)
	console.log('TestApi - apiData?.data?.data:', apiData?.data?.data)

	return (
		<div style={{ padding: 20, color: 'white' }}>
			<h1>API Test</h1>
			<p>Environment: {import.meta.env.VITE_API_BASE_URL}</p>
			
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: 'red' }}>Error: {error}</p>}
			{result && (
				<div>
					<p>Success! Data received:</p>
					<pre style={{ background: '#333', padding: 10, borderRadius: 5 }}>
						{JSON.stringify(result, null, 2)}
					</pre>
				</div>
			)}
			
			{apiData && (
				<div style={{ marginTop: 20 }}>
					<h3>useApi Hook Result:</h3>
					<p>Loading: {apiLoading ? 'Yes' : 'No'}</p>
					<p>Error: {apiError || 'None'}</p>
					<p>Data structure: {JSON.stringify(apiData, null, 2)}</p>
					{apiData?.data?.data && (
						<div>
							<p>Products found: {apiData.data.data.length}</p>
							<ul>
								{apiData.data.data.map((product: any, index: number) => (
									<li key={index}>{product.name} - {product.price}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}
			
			<button onClick={testApi} style={{ padding: 10, marginTop: 10 }}>
				Test API Again
			</button>
		</div>
	)
}
