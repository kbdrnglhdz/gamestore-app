# Catalog Specification

## Purpose
Product listing, filtering, and pagination for GameStore.

## Requirements

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

### Requirement: Price Filter
Users SHALL filter products by price range using numeric comparison.

#### Scenario: Filter by minimum price
- **WHEN** the user applies filter with minPrice of 10
- **THEN** only products with price >= 10.00 are shown

#### Scenario: Filter by maximum price
- **WHEN** the user applies filter with maxPrice of 30
- **THEN** only products with price <= 30.00 are shown

#### Scenario: Filter by price range
- **WHEN** the user applies filter price between 10 and 30
- **THEN** products with price 15 and 25 are shown (numeric comparison, not alphabetical)

#### Scenario: Price sort ascending
- **WHEN** the user selects "Price: Low to High" sort
- **THEN** products are sorted by price ascending (10.00, 20.00, 100.00 - numeric order)

#### Scenario: Price sort descending
- **WHEN** the user selects "Price: High to Low" sort
- **THEN** products are sorted by price descending (100.00, 20.00, 10.00 - numeric order)

### Requirement: Product Images
Users SHALL see product images displayed correctly.

#### Scenario: Image loads from CDN
- **WHEN** a product has an image configured
- **THEN** the image loads from CDN URL

### Requirement: Stock Validation in Catalog
The catalog SHALL validate stock values when creating or updating products through the products API.

#### Scenario: Create product with valid stock
- **WHEN** a POST request is made to /api/products with stock >= 0
- **THEN** the product is created with the specified stock value

#### Scenario: Create product with negative stock
- **WHEN** a POST request is made to /api/products with stock < 0
- **THEN** the system SHALL return a 400 error

#### Scenario: Update product with valid stock
- **WHEN** a PUT request is made to /api/products/:id with stock >= 0
- **THEN** the product is updated with the specified stock value

#### Scenario: Update product with negative stock
- **WHEN** a PUT request is made to /api/products/:id with stock < 0
- **THEN** the system SHALL return a 400 error

### Requirement: Stock Validation on Checkout
The system SHALL validate that sufficient stock exists for all items in the cart before creating an order.

#### Scenario: Sufficient stock
- **WHEN** a user checks out with items that have sufficient stock
- **THEN** the order is created and stock is deducted

#### Scenario: Insufficient stock for one item
- **WHEN** a user checks out with an item where cart quantity exceeds available stock
- **THEN** the system SHALL return a 400 error with message "Insufficient stock for <product name>. Available: <available stock>"

#### Scenario: Insufficient stock for multiple items
- **WHEN** a user checks out with multiple items that have insufficient stock
- **THEN** the system SHALL return a 400 error listing all items with insufficient stock

#### Scenario: Stock deduction on order
- **WHEN** an order is successfully created
- **THEN** the stock for each product in the order SHALL be reduced by the ordered quantity