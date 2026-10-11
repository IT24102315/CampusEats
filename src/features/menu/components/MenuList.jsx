import { Link } from 'react-router-dom'
export function DishCard({ dish }) {
 return <article className="dish-card"><div className="dish-art" aria-hidden="true">{({ Mains: '🍲', Snacks: '🥪', Dessert: '🍮', Drinks: '🥤' })[dish.category] || '🍽️'}</div><div className="dish-body"><span className="category">{dish.category}</span><h2>{dish.name}</h2><p className="price">Rs. {dish.price.toFixed(2)}</p><span className={dish.available ? 'badge' : 'badge sold'}>{dish.available ? 'Available today' : 'Sold out'}</span><Link className="detail-link" to={`/dish/${dish.id}`}>View dish →</Link></div></article>
}
export default function MenuList({ dishes }) {
 return dishes.length ? <div className="menu-grid">{dishes.map(dish => <DishCard key={dish.id} dish={dish} />)}</div> : <p className="notice">No dishes match your search.</p>
}
