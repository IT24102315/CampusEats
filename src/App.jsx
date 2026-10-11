import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import MenuPage from './features/menu/pages/MenuPage'
import DishDetailPage from './features/menu/pages/DishDetailPage'
import OrderPage from './features/menu/pages/OrderPage'
import AccountPage from './features/menu/pages/AccountPage'
import './App.css'
export default function App() {
 return <BrowserRouter><header><NavLink className="brand" to="/">Campus<span>Eats</span><small>THE CAMPUS KITCHEN</small></NavLink><nav aria-label="Main navigation"><NavLink to="/">Menu</NavLink><NavLink to="/order">Place order</NavLink><NavLink to="/account">Account</NavLink></nav></header><main><Routes><Route path="/" element={<MenuPage />} /><Route path="/dish/:id" element={<DishDetailPage />} /><Route path="/order" element={<OrderPage />} /><Route path="/account" element={<AccountPage />} /><Route path="*" element={<h1>404 — Page not found</h1>} /></Routes></main><footer>CampusEats · Made for your between-class cravings.</footer></BrowserRouter>
}
