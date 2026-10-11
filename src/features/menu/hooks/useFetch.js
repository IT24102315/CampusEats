import { useEffect, useState } from 'react'
export function useFetch(url) {
 const [state, setState] = useState({ data: null, isLoading: true, error: null })
 useEffect(() => {
  const controller = new AbortController()
  // Reset the three request states whenever a new URL starts loading.
  // oxlint-disable-next-line react/set-state-in-effect
  setState({ data: null, isLoading: true, error: null })
  fetch(url, { signal: controller.signal }).then(async response => {
   if (!response.ok) throw new Error(`HTTP ${response.status}`)
   return response.json()
  }).then(data => { if (!controller.signal.aborted) setState({ data, isLoading: false, error: null }) })
   .catch(error => { if (!controller.signal.aborted) setState({ data: null, isLoading: false, error: error.message }) })
  return () => controller.abort()
 }, [url])
 return state
}
