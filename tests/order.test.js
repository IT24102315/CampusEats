import test from 'node:test'
import assert from 'node:assert/strict'
import { validateOrder } from '../src/features/menu/services/validateOrder.js'
test('valid order accepts a whole positive quantity', () => {
 assert.deepEqual(validateOrder({ name: 'Student', email: 'student@example.com', qty: '2' }), {})
})
test('blank identity and invalid email produce field errors', () => {
 const errors = validateOrder({ name: ' ', email: 'bad', qty: '1' })
 assert.ok(errors.name); assert.ok(errors.email)
})
test('empty, fractional, negative, and nonfinite quantities are rejected', () => {
 for (const qty of ['', '0', '-1', '1.5', 'Infinity', 'abc']) {
  assert.ok(validateOrder({ name: 'Student', email: 'student@example.com', qty }).qty)
 }
})
