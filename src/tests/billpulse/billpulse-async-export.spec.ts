import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/billpulse/LoginPage.js';
import { InvoiceDashboardPage } from '../../pages/billpulse/InvoiceDashboardPage.js';

test.describe('E2E: BillPulse Asynchronous CSV Export Job & Download', () => {
  let loginPage: LoginPage;
  let dashboard: InvoiceDashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboard = new InvoiceDashboardPage(page);

    await loginPage.navigate();
    await loginPage.loginAs('ADMIN');
  });

  test('should trigger async CSV generation, display progress state, and complete download', async ({ page }) => {
    await expect(dashboard.exportCsvButton).toBeVisible();

    // Trigger async export job
    await dashboard.exportCsvButton.click();

    // Verify button switches to download link once background worker completes
    await expect(dashboard.downloadCsvButton).toBeVisible({ timeout: 5000 });

    // Download file event listener
    const downloadPromise = page.waitForEvent('download');
    await dashboard.downloadCsvButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.csv$/i);
  });
});
