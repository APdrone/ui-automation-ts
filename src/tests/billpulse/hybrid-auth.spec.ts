import { test, expect } from '@playwright/test';
import { BillPulseAuthController } from '../../controllers/billPulseAuthController.js';
import { InvoiceDashboardPage } from '../../pages/billpulse/InvoiceDashboardPage.js';

test.describe('E2E Hybrid: API Pre-Seeded Fast-Path Authentication', () => {
  test('should bypass UI login form by pre-seeding JWT session via AuthController', async ({ page, request }) => {
    const authController = new BillPulseAuthController(request);
    const dashboard = new InvoiceDashboardPage(page);

    // 1. Pre-seed session via background API call using BaseApi controller
    await authController.preSeedAuthSession(page, 'manager@billpulse.io', 'Password123!');

    // 2. Navigate directly to dashboard root
    await page.goto('/');

    // 3. Verify user lands directly on Dashboard with MANAGER role without viewing login form
    await expect(dashboard.navbar.navbar).toBeVisible();
    await expect(dashboard.navbar.userRoleBadge).toHaveText('MANAGER');
    await expect(dashboard.createInvoiceButton).toBeVisible();
  });
});
