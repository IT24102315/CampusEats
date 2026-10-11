const API = import.meta.env.VITE_API_URL

export async function getMenu({ signal } = {}) {
  if (!API) {
    throw new Error("Set VITE_API_URL and restart or rebuild the frontend.")
  }
  const response = await fetch(`${API.replace(/\/+$/, "")}/api/menu`, { signal })
  if (!response.ok) {
    throw new Error(`Menu request failed (${response.status})`)
  }
  return response.json()
}
