# Playwright E2E Test Suite (`pw-e2e-ts`)

> Production-ready End-to-End (E2E) UI Automation Test Suite powered by Playwright, TypeScript, and `@script-crux` framework adapters.

---

## 🏛️ Architecture & Layered Design

```
pw-e2e-ts/
├── .github/workflows/         # CI/CD Pipeline (GitHub Actions)
├── playwright.config.ts        # Playwright Orchestration & Execution Config
├── tsconfig.json
│
├── src/
│   ├── config/                # 1. CONFIGURATION LAYER
│   │   ├── env.config.ts      # Multi-environment validation (.env.qa, .env.stg)
│   │   ├── constants.ts       # Timeouts, endpoints, static selectors
│   │   └── mock-router.ts     # Network mocking and interception
│   │
│   ├── pages/                 # 2. PAGE OBJECT / ADAPTATION LAYER
│   │   ├── components/        # Reusable UI components (Header, Footer, Modals)
│   │   ├── base.page.ts       # Abstract Base Page with resilient wait wrappers
│   │   ├── login.page.ts
│   │   ├── inventory.page.ts
│   │   └── checkout.page.ts
│   │
│   └── core/                  # 3. TEST UTILITIES & HOOKS
│       ├── global.setup.ts    # Authentication state capture
│       ├── array.utils.ts     # Data sorting & verification algorithms
│       └── logger.utils.ts    # Structured test execution logs
│
├── tests/                     # 4. TEST SPECIFICATION LAYER
│   ├── data/
│   │   └── test-data.json     # Parameterized test data sets
│   ├── e2e-checkout.spec.ts   # Core business checkout workflows
│   ├── sorting.spec.ts        # Inventory sorting & filter validations
│   ├── multi-tab.spec.ts      # Multi-page / new window browser scenarios
│   └── network-fault.spec.ts  # Network resilience and error-handling tests
│
├── .env.qa                    # QA environment configurations
└── .env.stg                   # Staging environment configurations
```

---

## 📦 Framework Dependencies

This project consumes the modular framework packages:
- [`@script-crux/adapter-playwright`](https://www.npmjs.com/package/@script-crux/adapter-playwright): Provides step decorators, custom reporters, and browser management helpers.
- [`@script-crux/core-shared`](https://www.npmjs.com/package/@script-crux/core-shared): Provides central logging, retry strategies, and environment loaders.
- [`@script-crux/core-api`](https://www.npmjs.com/package/@script-crux/core-api): Test data seeding and database validation.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 18
- `npm` or `pnpm`

### 2. Installation

```bash
# Install dependencies
npm install

# Install Playwright browser binaries
npx playwright install --with-deps
```

### 3. Execution

```bash
# Run all tests headlessly
npx playwright test

# Run tests in UI mode (Interactive)
npx playwright test --ui

# Run tests against a specific environment
ENV=qa npx playwright test

# Run a specific test spec
npx playwright test tests/e2e-checkout.spec.ts

# View HTML Test Report
npx playwright show-report
```

---

## 📊 Reporting & CI/CD

- **HTML Report:** Generated automatically on each test run under `playwright-report/`.
- **ReportPortal Integration:** Enable live test reporting via environment variables:
  ```bash
  RP_ENABLED=true RP_API_KEY="<your_token>" RP_PROJECT="<project_name>" npx playwright test
  ```
- **GitHub Actions:** Automated test runs on every pull request and scheduled nightly runs.

---

## 📄 License
ISC
