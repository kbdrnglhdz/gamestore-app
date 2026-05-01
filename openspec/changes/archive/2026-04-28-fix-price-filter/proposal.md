## Why

The price filter and sort functionality is broken because the price is stored as a String in the database. This causes alphabetical comparison (e.g., "10" < "2") instead of numeric comparison. Users cannot reliably filter products by price range or sort by price correctly.

## What Changes

- **Backend**: Change Prisma schema `price` field from `String` to `Decimal` type for proper numeric storage and comparison
- **Backend**: Update products route to parse `minPrice` and `maxPrice` as numbers instead of strings
- **Backend**: Run Prisma migration to update the database schema
- **Frontend**: Update Product interface to use `number` type for price instead of `string`

## Capabilities

### New Capabilities

<!-- No new capabilities - this is a bug fix -->

### Modified Capabilities

- `catalog`: Fix price filter and sort to use numeric comparison instead of alphabetical

## Impact

- **Database**: Prisma schema change requires migration to alter `price` column type from String to Decimal
- **Backend**: `backend/prisma/schema.prisma` - Change price field type
- **Backend**: `backend/src/routes/products.ts` - Parse price filter as numbers, remove string comparison FIXME comments
- **Frontend**: `frontend/src/pages/Products.tsx` - Update Product interface price type from string to number
- **Data**: Existing price data will be migrated (Prisma migration handles conversion)
