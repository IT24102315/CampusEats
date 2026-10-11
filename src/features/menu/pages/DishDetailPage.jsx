import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { menuUrl } from '../services/menuApi'
export default function DishDetailPage() {
 const { id } = useParams(); const { data, isLoading, error } = useFetch(menuUrl)
 if (isLoading) return <p role="status">Loading dish…</p>
 if (error) return <p role="alert">Could not load dish: {error}</p>
 const dish = data.find(d => String(d.id) === id)
 if (!dish) return <><h1>Dish not found</h1><Link to="/">Back to menu</Link></>
 return <section className="panel"><Link to="/">← Back to menu</Link><p className="eyebrow">{dish.category}</p><h1>{dish.name}</h1><p className="price">Rs. {dish.price.toFixed(2)}</p><p>{dish.available ? 'Available for your next campus break.' : 'This dish is currently sold out.'}</p>{dish.available && <Link className="button" to={`/order?dish=${dish.id}`}>Place an order</Link>}</section>
}
