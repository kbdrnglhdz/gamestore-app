## MODIFIED Requirements

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

### Requirement: Session Persistence
Users SHALL maintain session for a configurable duration after login, with clear error messages on failure.

#### Scenario: Invalid refresh token
- **WHEN** the user requests `/auth/refresh` with an invalid refresh token
- **THEN** an error message "Your session has expired. Please log in again." is displayed

#### Scenario: User not found on session check
- **WHEN** the user requests `/auth/me` and the user account no longer exists
- **THEN** an error message "User account not found. Please contact support." is displayed
