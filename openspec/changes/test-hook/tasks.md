## 1. Backend - Hook Test Endpoint (Est. 0.5h)

- [ ] 1.1 Create `backend/src/routes/hook-test.ts` with GET /api/hook-test endpoint
- [ ] 1.2 Implement endpoint handler that returns JSON: { "message": "Prueba de hook" }
- [ ] 1.3 Register hook-test route in main backend app

## 2. Verification (Est. 0.5h)

- [ ] 2.1 Test endpoint with curl: `curl http://localhost:3000/api/hook-test`
- [ ] 2.2 Verify response is 200 with correct JSON message
- [ ] 2.3 Run `npm run lint` and `npm run typecheck` in backend
