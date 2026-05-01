## Context

GameStore currently has no validation for stock values. The products route allows creating and updating products with negative stock values. Additionally, the checkout process (orders route) does not validate if sufficient stock exists before creating an order. The Prisma schema defines stock as an `Int` type without constraints.

## Goals / Non-Goals

**Goals:**
- Prevent negative stock values when creating or updating products
- Validate stock availability during checkout before order creation
- Return clear, consistent error messages for stock validation failures

**Non-Goals:**
- Implementing stock reservation/locking mechanisms
- Adding stock history or audit trails
- Changing the frontend UI (handled separately)

## Decisions

1. **Input validation in route handlers** (over middleware or schema-level validation)
   - Rationale: Keeps validation close to the business logic and consistent with existing codebase patterns
   - Alternatives considered: Express middleware, Prisma schema validation, Zod schema validation

2. **Check stock at checkout time only** (over pre-checkout reservation)
   - Rationale: Simpler implementation, sufficient for current scale
   - Alternatives considered: Reserve stock when adding to cart, implement distributed locking

3. **Atomic stock deduction with order creation**
   - Rationale: Use Prisma transaction to ensure stock is only deducted if order succeeds
   - Alternatives considered: Separate stock update after order, eventual consistency pattern

## Risks / Trade-offs

- [Race condition on checkout] → Use Prisma transaction to atomically check and deduct stock
- [Negative stock edge case] → Validate stock >= 0 on all update paths including order deduction
- [Additional latency] → Stock validation adds minimal overhead; acceptable trade-off for data integrity
