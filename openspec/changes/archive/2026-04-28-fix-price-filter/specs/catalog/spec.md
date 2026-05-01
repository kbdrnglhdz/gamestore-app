## MODIFIED Requirements

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
