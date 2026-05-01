## Context

The auth system uses JWT tokens with a hardcoded 15-minute access token expiration. Current flow:
- User logs in → receives access token (15min) + refresh token (7d)
- Access token expires after 15min
- Frontend should use refresh token to get new access token via `/auth/refresh`

Current implementation issues:
- Access token expires too quickly (15 minutes)
- Refresh token endpoint may not properly validate or extend sessions
- No session activity tracking on frontend
- Session timeout is hardcoded, not configurable

## Goals / Non-Goals

**Goals:**
- Increase default session timeout to 1 hour (configurable)
- Fix refresh token flow to properly extend sessions
- Make timeout configurable via environment variable
- Add frontend activity tracking for session extension

**Non-Goals:**
- No persistent remember-me functionality
- No concurrent session management
- No session invalidation by admin

## Decisions

### Decision: Token expiration configuration
- **Choice:** Use environment variable `SESSION_TIMEOUT` (in minutes), fallback to 60 minutes
- **Rationale:** Simple configuration without adding new config files; common pattern
- **Alternative:** Config file per service - overkill for single value

### Decision: Frontend activity tracking
- **Choice:** Track last activity timestamp in localStorage, extend on each API call
- **Rationale:** Minimal overhead; sessions extend automatically on user activity
- **Alternative:** Polling interval - adds unnecessary network calls

### Decision: Refresh token validation
- **Choice:** Verify refresh token in DB before issuing new access token
- **Rationale:** Allows session invalidation if needed; more secure
- **Alternative:** JWT-only validation - less flexible

## Risks / Trade-offs

- [Risk] Longer tokens increase window for token theft → **Mitigation:** Use HTTP-only cookies; short refresh token lifetime (7 days)
- [Risk] User frustration if they lose work → **Mitigation:** Show warning before expiry; allow manual refresh

## Migration Plan

1. Update backend `generateToken` to use configurable timeout from env
2. Update auth spec to reflect configurable timeout (change from 15 min)
3. Add refresh token DB validation in `/auth/refresh`
4. Update frontend to track activity and auto-refresh

## Open Questions

- Should we add a warning notification before session expires?
- Should we allow longer timeout for admin users?