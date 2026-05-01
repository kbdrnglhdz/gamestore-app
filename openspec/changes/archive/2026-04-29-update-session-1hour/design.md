## Context

The GameStore application uses JWT-based authentication with configurable session timeouts. The backend reads `SESSION_TIMEOUT` from environment variables (defaulting to 60 minutes), and the frontend has hardcoded session timeout constants that should align with the backend. Current `.env` already sets `SESSION_TIMEOUT=60`, and frontend uses `60 * 60 * 1000` ms. This change ensures explicit 1-hour session configuration across all layers.

## Goals / Non-Goals

**Goals:**
- Ensure SESSION_TIMEOUT is explicitly set to 60 (1 hour) in .env
- Verify backend JWT token generation uses the 1-hour timeout
- Verify frontend session warning/timeout logic aligns with backend
- Document the 1-hour session timeout as the standard configuration

**Non-Goals:**
- No changes to refresh token mechanism (remains 7 days)
- No changes to authentication flow or token structure
- No changes to session refresh behavior

## Decisions

**Keep SESSION_TIMEOUT in minutes (not seconds or hours)**
- Rationale: Current implementation uses minutes, changing would require updates to middleware token generation and could cause confusion
- Alternative considered: Switch to seconds for consistency with frontend ms values - rejected as it would require backend changes and increase risk

**Keep frontend timeout hardcoded, aligned with backend default**
- Rationale: Frontend uses hardcoded `60 * 60 * 1000` ms which equals backend default of 60 minutes - this is acceptable alignment
- Alternative considered: Fetch SESSION_TIMEOUT from backend at runtime - rejected as unnecessary complexity for a stable configuration value

**No code changes required, configuration already aligned**
- Rationale: Review of current code shows `.env` has `SESSION_TIMEOUT=60`, backend defaults to 60, frontend uses 60 minutes - all layers already aligned to 1 hour
- This change serves as documentation and verification that configuration is correct

## Risks / Trade-offs

[Risk: Frontend/backend drift if SESSION_TIMEOUT is changed in .env] → Mitigation: Frontend uses hardcoded value matching default; if custom timeout needed, frontend should also be updated
[Risk: Hardcoded frontend value may diverge from backend over time] → Mitigation: Document the alignment requirement; consider adding runtime config endpoint in future if timeouts become more dynamic
