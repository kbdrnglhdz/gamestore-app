## MODIFIED Requirements

### Requirement: Product Pagination
Users SHALL view products paginated with correct skip-based pagination. The system SHALL use deterministic ordering to ensure consistent results across pages.

#### Scenario: First page
- **WHEN** the user requests page 1 with 50 products in database
- **THEN** products 1-10 are returned in deterministic order (sorted by createdAt desc, then id asc)

#### Scenario: Second page
- **WHEN** the user requests page 2 with 50 products in database
- **THEN** products 11-20 are returned in deterministic order (sorted by createdAt desc, then id asc)

#### Scenario: Deterministic ordering
- **WHEN** multiple products have the same createdAt timestamp
- **THEN** products are ordered by id ascending to ensure deterministic pagination

#### Scenario: Pagination with limit
- **WHEN** the user requests page 3 with limit 5
- **THEN** the system SHALL skip the first 10 products ((3-1) * 5 = 10) and return products 11-15
