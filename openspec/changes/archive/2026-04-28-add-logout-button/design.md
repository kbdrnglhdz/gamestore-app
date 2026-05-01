## Context

The GameStore application has authentication functionality with login, register, and logout capabilities. Currently, the logout button in the Navbar (`frontend/src/components/Navbar.tsx:26-28`) triggers an immediate logout without confirmation. The `AuthContext.tsx` provides the `logout` function that calls `api.auth.logout()` and `clearTokens()`.

The goal is to improve the logout user experience by adding a confirmation dialog and enhancing the visual feedback.

## Goals / Non-Goals

**Goals:**
- Add a confirmation dialog before logout to prevent accidental logouts
- Improve logout button visibility and styling in the Navbar
- Ensure proper cleanup of all session-related data (tokens, cart, user state)

**Non-Goals:**
- No backend changes required (logout endpoint already exists at `/auth/logout`)
- No changes to session timeout logic
- No changes to the AuthContext API (logout function signature stays the same)

## Decisions

### 1. Use a confirmation dialog component

**Decision**: Create a simple confirmation modal that appears when the logout button is clicked.

**Rationale**: Prevents accidental logouts which can be frustrating for users. A simple "Are you sure?" dialog is standard UX pattern.

**Alternatives considered**:
- Confirmation on button hover: Not reliable on mobile/touch devices
- Undo snackbar after logout: More complex, requires keeping session briefly alive
- No confirmation: Current behavior, prone to accidental logouts

### 2. Keep logout in Navbar vs separate component

**Decision**: Enhance the existing logout button in Navbar with confirmation dialog inline.

**Rationale**: The Navbar already has the logout button. Adding a confirmation dialog can be done with a state variable in Navbar or by extracting to a `LogoutButton` component.

**Alternatives considered**:
- Extract to separate `LogoutButton.tsx` component: Cleaner, reusable, but more files to manage
- Add dropdown menu for user actions: More complex, may be overkill for just logout

### 3. Cleanup strategy on logout

**Decision**: Continue using the existing `logout()` function from AuthContext which already calls `api.auth.logout()` and `clearTokens()`.

**Rationale**: The existing implementation properly clears tokens from localStorage and resets user state. The cart state is managed separately by CartContext.

**Alternatives considered**:
- Also clear cart on logout: Could be desired behavior, but not specified in requirements
- Call backend logout endpoint differently: Current implementation is correct

## Risks / Trade-offs

- **[Risk]** Confirmation dialog could annoy users who want quick logout → Make dialog simple with clear "Cancel" and "Logout" buttons
- **[Trade-off]** Adding state to Navbar for dialog visibility → Minor complexity increase, but manageable
- **[Risk]** Dialog not accessible (keyboard navigation, screen readers) → Use semantic HTML dialog element or accessible modal library
