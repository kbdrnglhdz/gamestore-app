 # Auth Specification

## Purpose
Authentication and session management for GameStore.

## Requirements

### Requirement: User Login
Users SHALL authenticate with email and password and receive clear error messages.

#### Scenario: Valid credentials
- **WHEN** the user submits login form with email "test@example.com" and password "secret"
- **THEN** a JWT access token is returned
- **AND** a refresh token is stored in HTTP-only cookie

#### Scenario: Invalid credentials
- **WHEN** the user submits login form with invalid email or password
- **THEN** an error message "Invalid email or password" is displayed
- **AND** no tokens are issued

#### Scenario: Empty fields
- **WHEN** the user submits login form with empty email or password
- **THEN** an error message "Please enter both email and password" is displayed
- **AND** no tokens are issued

### Requirement: Session Persistence
Users SHALL maintain session for a configurable duration after login, with clear error messages on failure. The default session timeout SHALL be 60 minutes (1 hour).

#### Scenario: Default session timeout
- **WHEN** `SESSION_TIMEOUT` env var is not set
- **THEN** session expires 60 minutes (1 hour) after login or last activity
- **AND** the user must log in again

#### Scenario: Explicit default session timeout
- **WHEN** `SESSION_TIMEOUT` env var is set to 60
- **THEN** session expires 60 minutes (1 hour) after login or last activity
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

### Requirement: User Registration
Users SHALL register with email, password, and name, with clear error messages.

#### Scenario: Valid registration
- **WHEN** the user submits registration with valid email, password, and name
- **THEN** a JWT access token is returned
- **AND** the user account is created

#### Scenario: Email already registered
- **WHEN** the user submits registration with an email that already exists
- **THEN** an error message "This email is already registered. Try logging in instead." is displayed
- **AND** no tokens are issued

### Requirement: Logout
Users SHALL be able to end their session with a confirmation dialog to prevent accidental logouts.

#### Scenario: User logout with confirmation
- **WHEN** the user clicks logout
- **THEN** a confirmation dialog is displayed asking "Are you sure you want to logout?"
- **AND** when the user confirms, the session is terminated and tokens are cleared

#### Scenario: User cancels logout
- **WHEN** the user clicks logout and then cancels the confirmation dialog
- **THEN** the session remains active and the user stays logged in

#### Scenario: Logout clears session data
- **WHEN** the user confirms logout
- **THEN** the session is terminated
- **AND** tokens are cleared from localStorage
- **AND** the user is redirected to the login page

### Requirement: Session Timeout Configuration Alignment
The SESSION_TIMEOUT environment variable MUST be explicitly set to 60 (1 hour) in the .env configuration file. Frontend session timeout constants MUST align with the backend SESSION_TIMEOUT value.

#### Scenario: Default .env configuration
- **WHEN** the .env file is checked
- **THEN** SESSION_TIMEOUT SHALL be set to 60

#### Scenario: Frontend timeout matches backend
- **WHEN** frontend session timeout constant is reviewed
- **THEN** it SHALL equal SESSION_TIMEOUT * 60 * 1000 milliseconds (60 minutes = 3600000 ms)

#### Scenario: Frontend warning timing
- **WHEN** session warning is triggered
- **THEN** it SHALL activate 5 minutes (300000 ms) before session expiry