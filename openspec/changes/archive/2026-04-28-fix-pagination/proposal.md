## Why

The product pagination API returns the same results on page 2+ because the `skip` parameter is commented out in the Prisma query. Additionally, the lack of deterministic ordering causes inconsistent results across pages. This fix addresses a critical bug affecting core product browsing functionality.

## What Changes

- **Backend**: Uncomment the `skip` parameter in the products endpoint Prisma query to enable proper pagination
- **Backend**: Add `id: 'asc'` to the `orderBy` clause to ensure deterministic ordering across pages
- **Frontend** (optional): Improve pagination UI with prev/next navigation and limited visible page buttons (max 5)

## Capabilities

### Modified Capabilities

- `catalog`: Fix pagination behavior to correctly skip records based on page/limit parameters and return deterministic results

## Impact

- **Backend**: `backend/src/routes/products.ts` - Prisma query modification
- **Frontend**: `frontend/src/pages/Products.tsx` - Optional pagination UI improvement
- **API**: `/api/products` endpoint will now correctly paginate results
- **Users**: Product browsing will work correctly across all pages
