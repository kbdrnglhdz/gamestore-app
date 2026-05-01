## Why

Currently, stock updates lack validation in GameStore. The products route allows creating/updating products with negative stock values, and the checkout route has no validation to ensure sufficient stock before creating orders. This can lead to data integrity issues and orders for out-of-stock items.

## What Changes

- Add validation to prevent negative stock values when creating products (POST /api/products)
- Add validation to prevent negative stock values when updating products (PUT /api/products/:id)
- Add stock validation during checkout to ensure sufficient stock for all items in cart
- Return appropriate error messages when stock validation fails

## Capabilities

### Modified Capabilities
- `catalog`: 
1. Existing catalog spec will be extended with stock validation requirements for product creation and updates.
2. Validation rules for stock updates and order stock checks, including preventing negative stock values and verifying sufficient stock during checkout

## Impact

- **Backend routes**: `backend/src/routes/products.ts` (stock validation on create/update), `backend/src/routes/orders.ts` (stock check on checkout)
- **API responses**: New validation error responses with appropriate HTTP status codes
- **Frontend**: May need to handle new validation error messages in product forms and checkout flow
