## Why

Reduce the session timeout from 60 minutes to 30 minutes to improve security posture. Shorter session windows limit the risk of unauthorized access from abandoned or compromised sessions, especially on shared or public devices.

## What Changes

- Update `SESSION_TIMEOUT` from 60 to 30 in `.env`
- Update backend default session timeout fallback from 60 to 30 minutes
- Update frontend session timeout constant from 60 minutes to 30 minutes
- Update frontend session warning to trigger 5 minutes before the new 30-minute expiry
- Update auth specification to reflect 30-minute default session timeout

## Capabilities

### New Capabilities

### Modified Capabilities

- `auth`: Session persistence requirement - default timeout changing from 60 minutes to 30 minutes

## Impact

- `.env`: SESSION_TIMEOUT changes from 60 to 30
- `backend/src/middleware/auth.ts`: Default fallback changes from 60 to 30
- `frontend/src/services/api.ts`: SESSION_TIMEOUT_MS changes from 3600000 to 1800000
- `openspec/specs/auth/spec.md`: Session timeout scenarios update to 30 minutes
