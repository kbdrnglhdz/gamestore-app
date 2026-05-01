## ADDED Requirements

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
