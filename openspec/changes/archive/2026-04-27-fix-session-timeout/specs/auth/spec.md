# Auth Specification - Delta

## MODIFIED Requirements

### Requirement: Session Persistence
Users SHALL maintain session for a configurable duration after login.

#### Scenario: Default session timeout
- **WHEN** `SESSION_TIMEOUT` env var is not set
- **THEN** session expires 60 minutes after login or last activity
- **AND** the user must log in again

#### Scenario: Custom session timeout
- **WHEN** `SESSION_TIMEOUT` env var is set to a value in minutes
- **THEN** session expires that many minutes after login or last activity
- **AND** the user must log in again

#### Scenario: Session refresh extends timeout
- **WHEN** the user requests `/auth/refresh` with a valid refresh token
- **THEN** a new access token is issued
- **AND** the session timeout window resets