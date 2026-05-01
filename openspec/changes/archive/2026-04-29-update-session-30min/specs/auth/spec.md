## MODIFIED Requirements

### Requirement: Session Persistence
Users SHALL maintain session for a configurable duration after login, with clear error messages on failure. The default session timeout SHALL be 60 minutes.

#### Scenario: Default session timeout
- **WHEN** `SESSION_TIMEOUT` env var is not set
- **THEN** session expires 60 minutes after login or last activity
- **AND** the user must log in again

#### Scenario: Explicit 30-minute session timeout
- **WHEN** `SESSION_TIMEOUT` env var is set to 60
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

#### Scenario: Invalid refresh token
- **WHEN** the user requests `/auth/refresh` with an invalid refresh token
- **THEN** an error message "Your session has expired. Please log in again." is displayed

#### Scenario: User not found on session check
- **WHEN** the user requests `/auth/me` and the user account no longer exists
- **THEN** an error message "User account not found. Please contact support." is displayed

#### Scenario: Frontend session timeout alignment
- **WHEN** the frontend tracks session activity
- **THEN** it SHALL use a timeout value consistent with the backend `SESSION_TIMEOUT` configuration (default: 60 minutes)
- **AND** session warnings SHALL be displayed 5 minutes before expiry
