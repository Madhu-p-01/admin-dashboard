import { useState, useCallback } from 'react'
import { useApi } from '@/lib/useApi'
import type { ApiResponse, PaginatedResult, TeamMember } from '@/types/api'

export default function Team() {
	const [page, setPage] = useState(1)
	const [limit] = useState(10)
	const [search, setSearch] = useState('')

	const transform = useCallback((res: ApiResponse<{ data: PaginatedResult<TeamMember> }>) => {
		if ((res as any).success === false) throw new Error((res as any).message)
		return (res as any).data
	}, [])

	const { data, loading, error } = useApi<{ data: PaginatedResult<TeamMember> }>({
		path: '/team',
		params: { page, limit, search: search || undefined },
		transform
	})

	const teamMembers = data?.data || []
	const meta = data?.meta
	const totalPages = meta?.totalPages || 1

	// Debug logging
	console.log('Team Debug - Raw data:', data)
	console.log('Team Debug - data?.data:', data?.data)
	console.log('Team Debug - Final teamMembers:', teamMembers)
	console.log('Team Debug - Meta:', meta)

	return (
		<div>
			<h1>Team</h1>
			<div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
				<input
					type="text"
					placeholder="Search team members..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{ padding: 8, borderRadius: 4, border: '1px solid #1e2733', background: '#0f1419', color: 'white' }}
				/>
			</div>

			{loading && <p>Loading...</p>}
			{error && <p style={{ color: 'salmon' }}>Error: {error}</p>}
			{!loading && !error && teamMembers.length === 0 && (
				<p>No team members found. Invite your first team member!</p>
			)}
			{!loading && !error && teamMembers.length > 0 && (
				<div>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr>
								<th align="left">Name</th>
								<th align="left">Email</th>
								<th align="left">Role</th>
								<th align="left">Status</th>
								<th align="left">Joined</th>
								<th align="left">Last Active</th>
							</tr>
						</thead>
						<tbody>
							{teamMembers.map((member) => (
								<tr key={member.id} style={{ borderTop: '1px solid #1e2733' }}>
									<td>{member.name}</td>
									<td>{member.email}</td>
									<td>{member.role}</td>
									<td>{member.isActive ? 'Active' : 'Inactive'}</td>
									<td>{new Date(member.createdAt).toLocaleDateString()}</td>
									<td>{member.lastActiveAt ? new Date(member.lastActiveAt).toLocaleDateString() : 'Never'}</td>
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
}



