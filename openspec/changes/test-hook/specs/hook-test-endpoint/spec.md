## ADDED Requirements

### Requirement: Hook Test Endpoint
The system SHALL provide a public GET endpoint that returns a JSON response with the message "Prueba de hook".

#### Scenario: Successful request to hook test endpoint
- **WHEN** a GET request is made to /api/hook-test
- **THEN** the system returns 200 status with JSON body: { "message": "Prueba de hook" }

#### Scenario: Request without authentication
- **WHEN** an unauthenticated user makes a GET request to /api/hook-test
- **THEN** the system returns 200 status with the message (endpoint is public)
