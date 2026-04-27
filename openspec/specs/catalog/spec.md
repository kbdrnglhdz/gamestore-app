# Catalog Specification

## Purpose
Product listing, filtering, and pagination for GameStore.

## Requirements

### Requirement: Product Pagination
Users SHALL view products paginated in pages of 10 items.

#### Scenario: First page
- **WHEN** the user requests page 1 with 50 products in database
- **THEN** products 1-10 are returned

#### Scenario: Second page
- **WHEN** the user requests page 2 with 50 products in database
- **THEN** products 11-20 are returned

### Requirement: Price Filter
Users SHALL filter products by price range.

#### Scenario: Filter by price
- **WHEN** the user applies filter price between 10 and 30
- **THEN** products with price 15 and 25 are shown

### Requirement: Product Images
Users SHALL see product images displayed correctly.

#### Scenario: Image loads from CDN
- **WHEN** a product has an image configured
- **THEN** the image loads from CDN URL