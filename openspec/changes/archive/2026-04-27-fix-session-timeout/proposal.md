## Why

Users are being logged out unexpectedly during active sessions. The current session timeout configuration uses a 15-minute access token expiration, which is too short for typical user workflows. Additionally, the refresh token mechanism may not be handling session extension properly, leading to poor user experience.

## What Changes

- Increase access token expiration from 15 minutes to a configurable duration (default 1 hour)
- Fix refresh token endpoint to properly extend sessions instead of requiring re-login
- Add session activity tracking to extend sessions on user activity
- Make session timeout configurable via environment variable

## Capabilities

### Modified Capabilities
- `auth`: Change token expiration from hardcoded 15 minutes to configurable 1 hour default

## Impact

- Backend: token generation in `auth.ts` middleware
- Frontend: auth service and token refresh logic in `api.ts`
- Configuration: Add `SESSION_TIMEOUT` environment variable

## Risks
- Cambiar el TTL puede invalidar tokens existentes.
- Necesitamos migrar sesiones activas o invalidarlas.