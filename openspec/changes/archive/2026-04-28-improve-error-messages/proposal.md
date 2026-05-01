## Why

The current login and registration error messages are generic ("Invalid credentials", "Email already exists") which can be confusing for users. More specific, user-friendly error messages are needed to help users understand what went wrong and how to fix it.

## What Changes

- **Backend**: Improve error messages in auth routes (login, register, refresh, logout, me endpoints)
- **Backend**: Add specific error messages for common scenarios (wrong email, wrong password, email already registered, invalid token)
- **Frontend**: Update Login and Register pages to display error messages more prominently with better styling
- **Frontend**: Add field-specific error messages where applicable (e.g., "Email is already registered" vs generic error)

## Capabilities

### New Capabilities

<!-- No new capabilities - enhancing existing auth functionality -->

### Modified Capabilities

- `auth`: Improve error message clarity and specificity for login, registration, and session endpoints

## Impact

- **Backend**: `backend/src/routes/auth.ts` - Update error messages in all auth endpoints
- **Frontend**: `frontend/src/pages/Login.tsx` - Improve error display
- **Frontend**: `frontend/src/pages/Register.tsx` - Improve error display (if exists)
- **User Experience**: Users will see clearer, more actionable error messages
