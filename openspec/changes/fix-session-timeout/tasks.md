## 1. Backend Configuration

- [ ] 1.1 Add SESSION_TIMEOUT environment variable support to auth middleware
- [ ] 1.2 Update generateToken to use configurable timeout (default 60 min)

## 2. Backend Refresh Endpoint

- [ ] 2.1 Fix /auth/refresh endpoint to validate refresh token in database
- [ ] 2.2 Issue new access token with extended expiration on successful refresh

## 3. Frontend Session Management

- [ ] 3.1 Add session activity tracking in localStorage
- [ ] 3.2 Update fetchWithAuth to track activity on each request
- [ ] 3.3 Add session warning when 5 minutes remain

## 4. Testing

- [ ] 4.1 Test default 60-minute timeout works
- [ ] 4.2 Test custom timeout via SESSION_TIMEOUT env var
- [ ] 4.3 Test refresh token extends session
- [ ] 4.4 Test activity tracking extends session
- [ ] 4.5 Test session warning appears before timeout