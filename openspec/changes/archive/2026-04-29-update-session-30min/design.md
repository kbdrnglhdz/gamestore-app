## Context

The GameStore application currently uses a 60-minute session timeout configured via the `SESSION_TIMEOUT` environment variable. The backend middleware (`auth.ts`) reads this value with a fallback default of 60 minutes. The frontend (`api.ts`) has a hardcoded `SESSION_TIMEOUT_MS` constant set to 3600000 ms (60 minutes). The session warning fires 5 minutes before expiry. This change reduces the timeout to 30 minutes across all layers.

## Goals / Non-Goals

**Goals:**
- Reduce session timeout from 60 minutes to 30 minutes
- Update backend default fallback to 30 minutes
- Update frontend session timeout constant to 1800000 ms (30 minutes)
- Keep warning timing at 5 minutes before expiry (now at 25 minutes into session)
- Update auth spec to reflect new 30-minute default

**Non-Goals:**
- No changes to refresh token mechanism (remains 7 days)
- No changes to authentication flow or token structure
- No changes to session refresh endpoint behavior
- No changes to logout flow

## Decisions

**Keep SESSION_TIMEOUT in minutes**
- Rationale: Consistent with current implementation; changing units would introduce unnecessary risk
- Alternative considered: Switch to seconds - rejected as it requires more code changes and adds confusion

**Keep frontend timeout hardcoded**
- Rationale: Simple and reliable; the value is stable and only changes infrequently
- Alternative considered: Fetch from backend at startup - rejected as over-engineering for a static config

**Keep warning at 5 minutes before expiry**
- Rationale: Provides sufficient time for user to react; proven UX pattern
- Alternative considered: Proportional warning (e.g., 1/6 of session) - rejected as inconsistent UX

## Risks / Trade-offs

[Risk: Users may find 30-minute sessions too short and need to re-login more frequently] → Mitigation: Refresh token endpoint allows extending session without re-authentication; frontend warning gives 5-minute notice
[Risk: Active long-form tasks (e.g., filling forms) may be interrupted] → Mitigation: Session warning at 25 minutes gives users time to save work or refresh session
[Risk: Backend and frontend drift if only one is updated] → Mitigation: Both files must be updated together; tasks are sequenced to ensure this
