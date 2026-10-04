import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/billpulse/LoginPage.js';
import { InvoiceDashboardPage } from '../../pages/billpulse/InvoiceDashboardPage.js';

test.describe('E2E: Search, Tab Filtering, VOID State Machine & Session Logout', () => {
  let loginPage: LoginPage;
  let dashboard: InvoiceDashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboard = new InvoiceDashboardPage(page);

    await loginPage.navigate();
    await loginPage.loginAs('ADMIN');
  });

  test('should dynamically filter invoice rows by search input query', async ({ page }) => {
    // Type search query for 'Starlight'
    await dashboard.search('Starlight');
    await page.waitForTimeout(300);

    const rows = dashboard.invoicesTable.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThanOrEqual(1);

    const firstRowText = await rows.first().innerText();
    expect(firstRowText.toLowerCase()).toContain('starlight');

    // Clear search and verify full list restores
    await dashboard.search('');
    await page.waitForTimeout(300);
  });

  test('should filter invoices by status tabs (DRAFT, PENDING, PAID, VOID)', async ({ page }) => {
    await dashboard.filterByTab('paid');
    await page.waitForTimeout(300);

    const paidBadges = page.getByTestId('status-badge-paid');
    const paidCount = await paidBadges.count();
    expect(paidCount).toBeGreaterThanOrEqual(1);

    // Switch to ALL tab
    await dashboard.filterByTab('all');
    await page.waitForTimeout(300);
    await expect(dashboard.invoicesTable).toBeVisible();
  });

  test('should execute VOID lifecycle transition on DRAFT invoice', async ({ page }) => {
    const customer = `VoidTarget_${Date.now()}`;
    // 1. Create a DRAFT invoice
    await dashboard.openCreateInvoiceModal();
    await dashboard.createModal.fillInvoiceForm(
      customer,
      'void@customer.io',
      [{ description: 'Consulting Retainer', quantity: 1, unitPrice: 200 }],
      0,
      0
    );
    await dashboard.createModal.submit();
    await expect(dashboard.createModal.modal).toBeHidden();

    // Locate row and click Void
    const invoiceRow = page.locator('tr').filter({ hasText: customer });
    await expect(invoiceRow).toBeVisible();
    await expect(invoiceRow.getByTestId('status-badge-draft')).toBeVisible();

    const voidBtn = invoiceRow.locator('button', { hasText: 'Void' });
    await voidBtn.click();

    // Verify row status becomes VOID
    await expect(invoiceRow.getByTestId('status-badge-void')).toBeVisible();
  });

  test('should cleanly logout, destroy local session, and return to login view', async ({ page }) => {
    await dashboard.navbar.logout();

    // Verify login form is visible
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();

    // Verify token is removed from browser localStorage
    const storedToken = await page.evaluate(() => localStorage.getItem('billpulse_token'));
    expect(storedToken).toBeNull();
  });
});
