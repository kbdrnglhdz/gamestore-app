## 1. Product Stock Validation

- [x] 1.1 Add stock validation in POST /api/products to reject negative stock values with 400 error
- [x] 1.2 Add stock validation in PUT /api/products/:id to reject negative stock values with 400 error

## 2. Checkout Stock Validation

- [x] 2.1 Add stock availability check in POST /api/orders/checkout before order creation
- [x] 2.2 Return 400 error with itemized insufficient stock messages when validation fails
- [x] 2.3 Use Prisma transaction to atomically validate stock and create order with stock deduction

## 3. Testing

- [x] 3.1 Add tests for negative stock validation on product create
- [x] 3.2 Add tests for negative stock validation on product update
- [x] 3.3 Add tests for insufficient stock checkout scenario
- [x] 3.4 Add tests for successful checkout with stock deduction
