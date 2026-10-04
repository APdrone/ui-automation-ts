# Playwright E2E Test Automation Suite (`pw-e2e-ts`)

> Production-ready End-to-End (E2E) UI Automation Test Suite powered by Playwright, TypeScript, and `@script-crux` framework adapters.

This repository automates the **BillPulse FinTech & SaaS Billing Platform**, validating real-time Server-Sent Events (SSE) updates, role-based access control (RBAC), network fault tolerance, and hybrid fast-path API authentication.

---

## 🏛️ Project Architecture

```
pw-e2e-ts/
├── playwright.config.ts        # Playwright Multi-Browser Configuration (Chromium, Firefox, WebKit)
├── tsconfig.json
│
├── src/
│   ├── api/                   # API Controllers for Hybrid E2E
│   │   └── billPulseAuthController.ts # Fast-path pre-seeded session authentication
│   │
│   ├── pages/                 # Page Object Models (POM) extending BasePage
│   │   ├── billpulse/
│   │   │   ├── LoginPage.ts                  # Persona selectors & credential login
│   │   │   ├── InvoiceDashboardPage.ts       # Table, search, filters, action triggers
│   │   │   ├── NavbarComponent.ts            # Persona badges, live SSE indicator, reset
│   │   │   └── CreateInvoiceModalComponent.ts # Dynamic pricing & multi-line invoice builder
│   │   └── sauceDemoApp/
│   │       ├── inventoryPage.ts
│   │       └── loginPage.ts
│   │
│   └── tests/                 # Automated E2E Test Suites
│       └── billpulse/
│           ├── billpulse-auth-rbac.spec.ts         # Persona presets (ADMIN, MANAGER, VIEWER)
│           ├── billpulse-invoice-flow.spec.ts      # Real-time SSE state advancement (DRAFT -> PAID)
│           ├── billpulse-hybrid-auth.spec.ts       # API fast-path JWT session pre-seeding
│           ├── billpulse-async-export.spec.ts      # Asynchronous CSV batch download
│           └── billpulse-resilience-and-softassert.spec.ts # Microservice 500 fault & SoftAssert
├── package.json
└── README.md
```

---

## 📦 Core Library Integration (`@script-crux`)

This suite actively consumes:
- **`@script-crux/adapter-playwright`**:
  - `BasePage`: Base page object class providing safe wait wrappers and logger hooks.
  - `BaseApi`: API request wrapper used for pre-seeding browser JWT tokens.
  - `SoftAssert`: Non-blocking multi-step assertions engine (`createSoftAssert()`).
  - `NetworkMocking`: Network route interceptor and microservice fault injector (`mockServiceFailure()`).
  - `EventStreamHelper`: Server-Sent Events (SSE) stream listener (`waitForClientEvent()`).
- **`@script-crux/core-shared`**: Central logger (`TestLogger`) and configuration loader (`ConfigManager`).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 18
- Running BillPulse Target Application:
  - Backend cluster: `npm run dev:server` in `app-billpulse` (ports 4000–4005)
  - Frontend client: `npm run dev:client` in `app-billpulse` (port 3000 / 3001)

### 2. Installation

```bash
# Install dependencies
npm install

# Install browser binaries (Chromium, Firefox, WebKit)
npx playwright install --with-deps
```

### 3. Running UI Tests

```bash
# Run all tests headlessly across configured browsers
npm test

# Run tests targeting Chromium
npm test -- --project=chromium

# Run tests in interactive UI mode
npx playwright test --ui

# Run a specific test suite
npm test -- src/tests/billpulse/billpulse-resilience-and-softassert.spec.ts
```

---

## 📄 License
ISC
