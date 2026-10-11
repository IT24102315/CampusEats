const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
export const menuUrl = API ? `${API}/api/menu` : '/menu.json'
export const demoMode = !API
export async function authenticate(action, values) {
 if (!API) throw new Error('Account features require a configured backend API.')
 const response = await fetch(`${API}/api/auth/${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
 const body = await response.json()
 if (!response.ok) throw new Error(body.message || body.title || `HTTP ${response.status}`)
 return body
}
