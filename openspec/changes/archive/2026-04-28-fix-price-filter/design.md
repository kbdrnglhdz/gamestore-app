## Context

The GameStore product catalog stores prices as `String` in the Prisma schema (`price: String`). This causes two bugs:
1. Price filtering (`minPrice`, `maxPrice`) does string comparison instead of numeric ("10" < "2" is true alphabetically)
2. Price sorting (`price_asc`, `price_desc`) sorts alphabetically instead of numerically

The fix requires changing the Prisma schema to use `Decimal` type (supports precise decimal math for currency) and updating all related code.

## Goals / Non-Goals

**Goals:**
- Fix price filter to use numeric comparison (gte, lte)
- Fix price sort to use numeric ordering
- Migrate existing price data from String to Decimal

**Non-Goals:**
- No changes to product creation/update API structure (just data types)
- No changes to price display format (frontend can still format as needed)
- No UI changes beyond type updates

## Decisions

### 1. Use Prisma `Decimal` type for price

**Decision**: Change `price: String` to `price: Decimal` in Prisma schema.

**Rationale**: `Decimal` is the correct type for currency values - it supports precise decimal math without floating-point errors. `Int` would not support cents/fractional prices.

**Alternatives considered**:
- `Int` (store cents): Works but requires conversion logic everywhere (price * 100)
- `Float`: Prone to floating-point precision errors with currency
- Keep `String` and convert at runtime: Bug-prone, can't use database-level comparisons

### 2. Parse price filter as Float in backend

**Decision**: Parse `minPrice` and `maxPrice` as `parseFloat()` in the products route.

**Rationale**: The query parameters come as strings, need to be converted to numbers for Prisma `Decimal` comparison. `parseFloat` handles both integers and decimals.

**Alternatives considered**:
- `parseInt`: Would lose decimal precision
- Keep as string: Would fail with Decimal type comparison

### 3. Migration strategy

**Decision**: Use Prisma migration to alter the column type. Prisma will generate SQL that converts existing String values to Decimal.

**Rationale**: Prisma's migration system handles schema changes safely. The `String` to `Decimal` conversion is straightforward for numeric strings.

**Alternatives considered**:
- Manual SQL migration: More control but defeats using Prisma
- Create new column, copy data, drop old: Overly complex for this change

## Risks / Trade-offs

- **[Risk]** Existing price data may not be valid numbers → Prisma migration will fail, need to clean data first
- **[Risk]** Frontend expects string for price → Update Product interface to use number
- **[Trade-off]** Decimal type requires Prisma Client update → Run `prisma generate` after migration
- **[Risk]** Price display formatting → Frontend may need to handle number-to-currency formatting
