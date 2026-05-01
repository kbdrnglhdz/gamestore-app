## 1. Database Schema Update

- [x] 1.1 Change `price` field in `backend/prisma/schema.prisma` from `String` to `Decimal`
- [x] 1.2 Run `npx prisma migrate dev` to create and apply the migration
- [x] 1.3 Run `npx prisma generate` to update the Prisma Client

## 2. Backend Price Filter Fix

- [x] 2.1 Update `backend/src/routes/products.ts` to parse `minPrice` and `maxPrice` as `parseFloat()` instead of string
- [x] 2.2 Remove the FIXME comments about price sorting alphabetically (lines 27-28, 36-37)
- [x] 2.3 Update product creation and update routes to store price as Decimal (use `parseFloat(price)` instead of `String(price)`)

## 3. Frontend Type Update

- [x] 3.1 Update `frontend/src/pages/Products.tsx` Product interface to change `price: string` to `price: number`
- [x] 3.2 Verify price display works correctly with numeric type (may need toFixed() for formatting)

## 4. Verification

- [x] 4.1 Test price filter with minPrice=10 and maxPrice=30, verify numeric comparison works
- [x] 4.2 Test price sort ascending, verify 10.00 comes before 100.00 (not alphabetical)
- [x] 4.3 Test creating a new product with decimal price (e.g., 29.99)
