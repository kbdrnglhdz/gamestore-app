## MODIFIED Requirements

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
