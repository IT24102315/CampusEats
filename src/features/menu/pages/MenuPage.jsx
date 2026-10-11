import { useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { useFetch } from '../hooks/useFetch'
import { menuUrl, demoMode } from '../services/menuApi'
import MenuList from '../components/MenuList'
export default function MenuPage() {
 const [query, setQuery] = useState('')
 const debounced = useDebounce(query)
 const { data, isLoading, error } = useFetch(menuUrl)
 return <><section className="hero"><span className="eyebrow">GOOD FOOD. BETWEEN CLASSES.</span><h1>Your next study break,<br />served fresh.</h1><p>Campus favourites, comforting classics, and a little something sweet.</p></section><section><div className="section-heading"><div><span className="eyebrow">THE CAMPUS MENU</span><h2>What are you craving?</h2></div><label className="search">Search dishes<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Try kottu or milo…" /></label></div>{demoMode && <p className="notice">Demo menu · Connect the backend to load live dishes.</p>}{isLoading ? <p role="status">Loading menu…</p> : error ? <p role="alert" className="notice">Could not load menu: {error}. Check the API configuration.</p> : <MenuList dishes={data.filter(d => d.name.toLowerCase().includes(debounced.toLowerCase()))} />}</section></>
}
