## 1. Backend Pagination Fix

- [x] 1.1 Uncomment `skip` parameter in `backend/src/routes/products.ts` Prisma query (remove comment on `skip: skip`)
- [x] 1.2 Add `id: 'asc'` to `orderBy` clause in products endpoint (change from `{ createdAt: 'desc' }` to `{ createdAt: 'desc', id: 'asc' }`)

## 2. Frontend Pagination UI (Optional)

- [x] 2.1 Add prev/next navigation buttons to pagination in `frontend/src/pages/Products.tsx`
- [x] 2.2 Limit visible page buttons to maximum 5 with sliding window logic

## 3. Verification

- [x] 3.1 Test pagination API with curl: verify page 1 and page 2 return different results
- [x] 3.2 Verify deterministic ordering by checking that products with same createdAt are ordered by id
