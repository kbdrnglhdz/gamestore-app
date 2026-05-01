## ADDED Requirements

### Requirement: Hook2 Test Endpoint
The system SHALL provide a public GET endpoint that returns a JSON response with the message "prueba de hook2".

#### Scenario: Successful request to hook2 test endpoint
- **WHEN** a GET request is made to /api/hook2-test
- **THEN** the system returns 200 status with JSON body: { "message": "prueba de hook2" }

#### Scenario: Request without authentication
- **WHEN** an unauthenticated user makes a GET request to /api/hook2-test
- **THEN** the system returns 200 status with the message (endpoint is public)
