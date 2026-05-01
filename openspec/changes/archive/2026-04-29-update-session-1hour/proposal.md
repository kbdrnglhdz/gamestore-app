## Why

The session timeout configuration should be explicitly set to 1 hour (60 minutes) across all environments to ensure consistent user experience and security posture. This change ensures backend, frontend, and environment configurations are aligned to a 1-hour session duration.

## What Changes

- Set `SESSION_TIMEOUT=60` (60 minutes = 1 hour) in `.env` configuration
- Ensure backend JWT token expiry uses the 1-hour session timeout
- Ensure frontend session warning and timeout logic aligns with 1-hour backend timeout
- Update session timeout constants in frontend to explicitly reflect 1-hour duration

## Capabilities

### New Capabilities
<!-- No new capabilities being introduced -->

### Modified Capabilities
- `auth`: Session persistence requirement - timeout explicitly set to 60 minutes (1 hour) with aligned frontend/backend configuration

## Impact

- `.env`: SESSION_TIMEOUT environment variable
- `backend/src/middleware/auth.ts`: JWT token generation with SESSION_TIMEOUT
- `backend/src/routes/auth.ts`: Session expiry error messages
- `frontend/src/services/api.ts`: Session timeout constants and warning logic
