export function validateOrder(form) {
 const errors = {}
 if (form.name.trim().length < 2) errors.name = 'Enter at least two characters.'
 if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = 'Enter a valid email.'
 if (!Number.isInteger(Number(form.qty)) || Number(form.qty) < 1) errors.qty = 'Quantity must be a positive whole number.'
 return errors
}
