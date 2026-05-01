## MODIFIED Requirements

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
