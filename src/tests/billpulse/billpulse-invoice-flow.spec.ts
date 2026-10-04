import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/billpulse/LoginPage.js';
import { InvoiceDashboardPage } from '../../pages/billpulse/InvoiceDashboardPage.js';

test.describe('E2E: Dynamic Invoice Creation & Real-Time SSE Payment Settlement', () => {
  let loginPage: LoginPage;
  let dashboard: InvoiceDashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboard = new InvoiceDashboardPage(page);

    await loginPage.navigate();
    await loginPage.loginAs('ADMIN');
    // Reset state to clean seed data
    await dashboard.navbar.resetState();
  });

  test('should compute dynamic pricing accurately in modal and create DRAFT invoice', async ({ page }) => {
    await dashboard.openCreateInvoiceModal();
    await expect(dashboard.createModal.modal).toBeVisible();

    // Fill form with multi-line items
    await dashboard.createModal.fillInvoiceForm(
      'Acme Quantum Dynamics',
      'procurement@acmequantum.com',
      [
        { description: 'Cloud Worker Node (24 Core)', quantity: 2, unitPrice: 500 }, // $1000
        { description: 'Global CDN Acceleration', quantity: 1, unitPrice: 200 },       // $200
      ],
      10, // 10% discount on $1200 = $120 -> $1080
      8.25 // 8.25% tax on $1080 = $89.10 -> Total = $1169.10
    );

    // Verify live recalculation in UI before submitting
    const calculatedTotal = await dashboard.createModal.getCalculatedTotal();
    expect(calculatedTotal).toBe('$1169.10');

    // Submit modal
    await dashboard.createModal.submit();
    await expect(dashboard.createModal.modal).toBeHidden();

    // Verify new invoice appears in table as DRAFT
    await expect(page.getByText('Acme Quantum Dynamics').first()).toBeVisible();
    await expect(page.getByText('$1169.10 USD').first()).toBeVisible();
  });

  test('should advance state from DRAFT -> PENDING -> PROCESSING -> PAID via Real-time SSE updates', async ({ page }) => {
    // 1. Create invoice
    await dashboard.openCreateInvoiceModal();
    await dashboard.createModal.fillInvoiceForm(
      'Starlight Robotics',
      'finance@starlight.io',
      [{ description: 'Edge Compute Module', quantity: 5, unitPrice: 100 }],
      0,
      0
    );
    await dashboard.createModal.submit();
    await expect(dashboard.createModal.modal).toBeHidden();

    const invoiceRow = page.locator('tr').filter({ hasText: 'Starlight Robotics' });
    await expect(invoiceRow).toBeVisible();
    await expect(invoiceRow.getByTestId('status-badge-draft')).toBeVisible();

    // 2. Click Submit on row -> status changes to PENDING
    const submitBtn = invoiceRow.locator('button', { hasText: 'Submit' });
    await submitBtn.click();
    await expect(invoiceRow.getByTestId('status-badge-pending')).toBeVisible();

    // 3. Click Pay -> Initiates async processing on backend
    const payBtn = invoiceRow.locator('button', { hasText: 'Pay' });
    await payBtn.click();

    // 4. Verify status transitions to PROCESSING then updates live to PAID via SSE without page reload
    await expect(invoiceRow.getByTestId('status-badge-processing')).toBeVisible();
    // Wait for SSE broadcast from background worker settling to PAID
    await expect(invoiceRow.getByTestId('status-badge-paid')).toBeVisible({ timeout: 5000 });
  });
});
