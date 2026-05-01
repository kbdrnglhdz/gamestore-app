## Context

The product listing API at `/api/products` uses Prisma's `findMany` with pagination parameters. Currently, the `skip` parameter is commented out in the query, causing all pages to return the same results (page 1 data). Additionally, the `orderBy` only uses `createdAt: 'desc'` without a secondary sort key, which can cause non-deterministic ordering when multiple records share the same `createdAt` value.

The fix is straightforward - a backend code change in `backend/src/routes/products.ts` plus an optional frontend UI improvement.

## Goals / Non-Goals

**Goals:**
- Fix pagination so page 2+ returns different (correct) results
- Ensure deterministic ordering across pages by adding `id` as secondary sort key
- Optionally improve frontend pagination UI with prev/next and limited visible pages

**Non-Goals:**
- No database schema changes
- No new API endpoints
- No changes to pagination parameters (page, limit) - they remain the same

## Decisions

### 1. Uncomment `skip` parameter in Prisma query

**Decision**: Enable the `skip` parameter that is currently commented out.

**Rationale**: The `skip` parameter calculates which records to skip based on `(page - 1) * limit`. Without it, Prisma returns from the first record every time.

**Alternatives considered**:
- Recalculate skip differently: Not needed, current calculation `(page - 1) * limit` is correct
- Use cursor-based pagination: Overkill for this fix, would be a larger refactor

### 2. Add `id: 'asc'` to `orderBy` clause

**Decision**: Change `orderBy: { createdAt: 'desc' }` to `orderBy: { createdAt: 'desc', id: 'asc' }`.

**Rationale**: Deterministic ordering is essential for correct pagination. Without a unique secondary sort key, records with the same `createdAt` could appear in undefined order, causing items to shift between pages.

**Alternatives considered**:
- Use only `id: 'asc'` as sort: Would lose the "newest first" behavior that users expect
- Use `updatedAt` as secondary: Less reliable than `id` which is guaranteed unique and sequential

### 3. Frontend pagination UI improvement (optional)

**Decision**: Add prev/next buttons and limit visible page buttons to 5.

**Rationale**: When there are many pages, showing all page buttons creates a poor UX. Limiting to 5 with prev/next provides better navigation.

## Risks / Trade-offs

- **[Risk]** Uncommenting `skip` changes behavior immediately → This is the intended fix, and the current behavior is broken
- **[Risk]** Adding `id` to `orderBy` may affect performance on very large tables → `id` is typically indexed as primary key, so impact is negligible
- **[Trade-off]** Frontend UI change is optional and could be deferred → Marked as optional in implementation tasks
