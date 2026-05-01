## Context

The GameStore authentication system uses generic error messages like "Invalid credentials" and "Email already exists". These messages don't help users understand exactly what went wrong or how to fix it. Additionally, the frontend displays errors as a simple red banner without styling differentiation between error types.

The auth routes are in `backend/src/routes/auth.ts` and the Login page is at `frontend/src/pages/Login.tsx`.

## Goals / Non-Goals

**Goals:**
- Provide specific, user-friendly error messages for common auth scenarios
- Differentiate between "user not found" and "wrong password" scenarios (without compromising security)
- Improve error display styling on frontend (Login, Register pages)
- Add error codes for programmatic handling where useful

**Non-Goals:**
- No backend structural changes (keep current error response format `{ error: message }`)
- No changes to password hashing (separate concern, has its own FIXME)
- No changes to session/token management

## Decisions

### 1. Error message strategy for login

**Decision**: Keep "Invalid credentials" for login failures (don't reveal if email or password is wrong for security), but add more context in other scenarios.

**Rationale**: Revealing "Email not found" vs "Wrong password" helps attackers enumerate valid emails. Security best practice is to use generic message for login.

**Alternatives considered**:
- Separate messages for wrong email vs wrong password: Insecure, enables email enumeration
- Add "Forgot password?" link with invalid credentials: Good UX, but separate feature

### 2. Improved messages for non-login scenarios

**Decision**: Use specific messages for:
- Registration: "Email is already registered. Try logging in instead." (instead of "Email already exists")
- Refresh token: "Your session has expired. Please log in again." (instead of "Invalid refresh token")
- User not found (me endpoint): "User account not found." (instead of "User not found")

**Rationale**: These scenarios don't have the same security concerns as login.

### 3. Frontend error display

**Decision**: Enhance the error div with icon and better styling, keep simple structure.

**Rationale**: Clear visual indication of errors without major refactoring.

**Alternatives considered**:
- Toast notifications: More complex, requires new dependency or state management
- Inline field errors: Would need backend to return field-specific errors

## Risks / Trade-offs

- **[Risk]** More specific messages could leak information → Keep login generic, be specific elsewhere
- **[Trade-off]** Better errors require touching multiple files → Minimal change, low risk
- **[Risk]** Styling inconsistencies across pages → Reuse same error styling pattern
