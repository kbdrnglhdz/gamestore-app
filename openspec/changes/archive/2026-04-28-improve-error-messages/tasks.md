## 1. Backend Error Message Improvements

- [x] 1.1 Update login error message in `backend/src/routes/auth.ts:51` to "Invalid email or password"
- [x] 1.2 Update registration error message at line 14 to "This email is already registered. Try logging in instead."
- [x] 1.3 Update refresh token error at line 73 to "Refresh token is required. Please log in again."
- [x] 1.4 Update invalid refresh token error at line 83 to "Your session has expired. Please log in again."
- [x] 1.5 Update user not found error at line 121 to "User account not found. Please contact support."

## 2. Frontend Error Display Improvements

- [x] 2.1 Update Login.tsx error div with better styling (icon, more prominent colors)
- [x] 2.2 Check Register.tsx exists and apply similar error styling improvements
- [x] 2.3 Add "Forgot password?" link near login error for better UX (optional)

## 3. Verification

- [x] 3.1 Test login with invalid credentials - verify "Invalid email or password" message appears
- [x] 3.2 Test registration with existing email - verify improved message with login link suggestion
- [x] 3.3 Test expired session - verify "session expired" message appears
