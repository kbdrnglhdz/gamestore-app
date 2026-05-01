## 1. Backend Configuration

- [ ] 1.1 Update SESSION_TIMEOUT from 60 to 30 in .env file
- [ ] 1.2 Update backend middleware default fallback from 60 to 30 in auth.ts

## 2. Frontend Alignment

- [ ] 2.1 Update SESSION_TIMEOUT_MS from 3600000 to 1800000 in api.ts
- [ ] 2.2 Update comment in api.ts to reflect 30-minute backend timeout

## 3. Specification Update

- [ ] 3.1 Archive delta spec to update main auth spec with 30-minute timeout
