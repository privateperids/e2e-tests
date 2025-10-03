# Playwright E2E Tests (TypeScript)

This repository contains Playwright TypeScript tests for both UI and API (Swagger-Notes) as requested.

## Included

- UI tests for two demo sites: `https://e-commerce-kib.netlify.app/` and `https://flutter-angular.web.app/`.
- API tests for a Swagger-Notes style API (`API_BASE_URL` env variable configurable).
- Playwright HTML reporter and screenshot attachments.
- GitHub Actions workflow for automated CI test runs.

## Setup & Run

```bash
git clone <repo-url>
cd playwright-e2e
npm ci
npx playwright install

# Run all tests
npm test

# Run headed
npm run test:headed

# Show report
npm run test:report
```

## API Base URL

```bash
export API_BASE_URL=https://practice.expandtesting.com/notes/api
npm test
```

## Notes

- Update UI selectors to match real DOM for stability.
- For auth-protected APIs, add token management in helpers.
- Negative tests and attaching responses/screenshots are bonus points.
