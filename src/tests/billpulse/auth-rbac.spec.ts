import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/billpulse/LoginPage.js';
import { InvoiceDashboardPage } from '../../pages/billpulse/InvoiceDashboardPage.js';

test.describe('E2E: BillPulse Authentication & RBAC Access Matrix', () => {
  let loginPage: LoginPage;
  let dashboardPage: InvoiceDashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new InvoiceDashboardPage(page);
    await loginPage.navigate();
  });

  test('should display RBAC persona presets and authenticate as ADMIN', async ({ page }) => {
    await loginPage.loginAs('ADMIN');

    // Verify Dashboard navigation and role badge
    await expect(dashboardPage.navbar.navbar).toBeVisible();
    await expect(dashboardPage.navbar.userRoleBadge).toHaveText('ADMIN');
    await expect(dashboardPage.createInvoiceButton).toBeEnabled();
  });

  test('should authenticate as MANAGER with invoice creation permissions', async () => {
    await loginPage.loginAs('MANAGER');

    await expect(dashboardPage.navbar.userRoleBadge).toHaveText('MANAGER');
    await expect(dashboardPage.createInvoiceButton).toBeEnabled();
  });

  test('should enforce Read-Only permissions for VIEWER persona (Create Invoice button disabled)', async () => {
    await loginPage.loginAs('VIEWER');

    await expect(dashboardPage.navbar.userRoleBadge).toHaveText('VIEWER');
    // Viewer cannot create invoices
    await expect(dashboardPage.createInvoiceButton).toBeDisabled();
  });

  test('should display validation error on invalid credentials', async () => {
    await loginPage.loginWithCredentials('invalid@billpulse.io', 'WrongPassword!');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email or password');
  });
});
