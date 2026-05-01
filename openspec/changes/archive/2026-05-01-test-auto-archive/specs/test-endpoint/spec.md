## ADDED Requirements

### Requirement: Test Script Endpoint
The system SHALL provide a public GET endpoint that returns a JSON response with the message "Probando scripts".

#### Scenario: Successful request to test endpoint
- **WHEN** a GET request is made to /api/test-script
- **THEN** the system returns 200 status with JSON body: { "message": "Probando scripts" }

#### Scenario: Request without authentication
- **WHEN** an unauthenticated user makes a GET request to /api/test-script
- **THEN** the system returns 200 status with the message (endpoint is public)
