 # Auth Specification

## Purpose
Authentication and session management for GameStore.

## Requirements

### Requirement: User Login
Users SHALL authenticate with email and password.

#### Scenario: Valid credentials
- **WHEN** the user submits login form with email "test@example.com" and password "secret"
- **THEN** a JWT access token is returned
- **AND** a refresh token is stored in HTTP-only cookie

#### Scenario: Invalid credentials
- **WHEN** the user submits login form with invalid email or password
- **THEN** an error message "Invalid credentials" is displayed
- **AND** no tokens are issued

### Requirement: Session Persistence
Users SHALL maintain session for 15 minutes after login.

#### Scenario: Session timeout
- **WHEN** 15 minutes pass without any request
- **THEN** the session expires
- **AND** the user must log in again

### Requirement: Password Storage
Users SHALL store passwords securely.

#### Scenario: Password is encrypted
- **WHEN** a user creates or updates their password
- **THEN** the password is stored encrypted in the database

### Requirement: Logout
Users SHALL be able to end their session.

#### Scenario: User logout
- **WHEN** the user clicks logout
- **THEN** the session is terminated
- **AND** tokens are cleared