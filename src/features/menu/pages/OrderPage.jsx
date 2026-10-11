import { useState } from 'react'
import { validateOrder } from '../services/validateOrder'
export default function OrderPage() {
 const [form, setForm] = useState({ name: '', email: '', qty: '1' }); const [errors, setErrors] = useState({}); const [done, setDone] = useState(false)
 function submit(e) {
  e.preventDefault(); const found = validateOrder(form)
  setErrors(found); if (!Object.keys(found).length) setDone(true)
 }
 return <section className="panel"><span className="eyebrow">YOUR CAMPUS BREAK</span><h1>Place an order</h1><p>This lab form demonstrates validation. Orders are not sent or saved.</p>{done ? <div role="status"><h2>Thanks, {form.name.trim()}!</h2><p>Your demo order passed validation.</p><button onClick={() => setDone(false)}>Start again</button></div> : <form onSubmit={submit} noValidate>{[['name', 'Your name', 'text'], ['email', 'Email address', 'email'], ['qty', 'Quantity', 'number']].map(([name, label, type]) => <label key={name}>{label}<input name={name} type={type} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} />{errors[name] && <span className="error" id={`${name}-error`}>{errors[name]}</span>}</label>)}<button>Validate order</button></form>}</section>
}
