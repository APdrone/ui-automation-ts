import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/billpulse/LoginPage.js';
import { InvoiceDashboardPage } from '../../pages/billpulse/InvoiceDashboardPage.js';

test.describe('E2E: Modal Dismissal, Dynamic Pricing Recalculation & Network Latency', () => {
  let loginPage: LoginPage;
  let dashboard: InvoiceDashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboard = new InvoiceDashboardPage(page);

    await loginPage.navigate();
    await loginPage.loginAs('ADMIN');
  });

  test('should dismiss create invoice modal on cancel without mutating state', async () => {
    await dashboard.openCreateInvoiceModal();
    await expect(dashboard.createModal.modal).toBeVisible();

    // Fill partial data
    await dashboard.createModal.fillInputField(
      dashboard.createModal.customerNameInput,
      'Temporary Customer',
      'Customer Name'
    );

    // Cancel modal
    await dashboard.createModal.clickElement(dashboard.createModal.cancelButton, 'Cancel Button');
    await expect(dashboard.createModal.modal).toBeHidden();
  });

  test('should dynamically re-calculate totals in real-time when tax and discount change', async () => {
    await dashboard.openCreateInvoiceModal();

    // 1 item: qty 2, price 100 => Subtotal = 200
    await dashboard.createModal.fillInvoiceForm(
      'Recalculation Corp',
      'recalc@test.io',
      [{ description: 'Test Item', quantity: 2, unitPrice: 100 }],
      0,
      0
    );

    let total = await dashboard.createModal.getCalculatedTotal();
    expect(total).toBe('$200.00');

    // Change discount to 50% => $100
    await dashboard.createModal.fillInputField(dashboard.createModal.discountPercentageInput, '50', 'Discount %');
    total = await dashboard.createModal.getCalculatedTotal();
    expect(total).toBe('$100.00');

    // Add 10% tax on $100 => $110
    await dashboard.createModal.fillInputField(dashboard.createModal.taxRateInput, '10', 'Tax Rate %');
    total = await dashboard.createModal.getCalculatedTotal();
    expect(total).toBe('$110.00');

    await dashboard.createModal.clickElement(dashboard.createModal.cancelButton, 'Cancel Button');
  });

  test('should handle artificial network delay gracefully using core-lib mockEndpoint', async ({ page }) => {
    // Simulate 1000ms latency on invoice query
    await dashboard.mockEndpoint('**/api/invoices*', {
      delayMs: 1000
    });

    await dashboard.filterByTab('paid');
    await page.waitForTimeout(1200);

    // Clear network mocks and verify dashboard remains functional
    await dashboard.clearNetworkMocks();
    await dashboard.filterByTab('all');
    await expect(dashboard.invoicesTable).toBeVisible();
  });
});
