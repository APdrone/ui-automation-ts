import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/billpulse/LoginPage.js';
import { InvoiceDashboardPage } from '../../pages/billpulse/InvoiceDashboardPage.js';

test.describe('Core-Lib: UI Network Mocking & Soft Assertions', () => {
  test('should verify multiple dashboard elements using framework SoftAssert', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new InvoiceDashboardPage(page);

    await loginPage.navigate();
    await loginPage.loginAs('ADMIN');

    await expect(dashboardPage.invoicesTable).toBeVisible();

    // Perform multi-attribute verification via core-lib SoftAssert
    const softAssert = dashboardPage.createSoftAssert();

    const isSearchVisible = await dashboardPage.isDisplayed(dashboardPage.searchInput, 'Search Input');
    softAssert.assertTrue(isSearchVisible, 'Search input should be displayed');

    const isCreateBtnVisible = await dashboardPage.isDisplayed(dashboardPage.createInvoiceButton, 'Create Invoice Button');
    softAssert.assertTrue(isCreateBtnVisible, 'Create Invoice button should be visible');

    const isExportBtnVisible = await dashboardPage.isDisplayed(dashboardPage.exportCsvButton, 'Export CSV Button');
    softAssert.assertTrue(isExportBtnVisible, 'Export CSV button should be visible');

    const roleBadgeText = await dashboardPage.getText(dashboardPage.navbar.userRoleBadge, 'User Role Badge');
    softAssert.assertContains(roleBadgeText.toUpperCase(), 'ADMIN', 'Role badge should state ADMIN');

    // Aggregate and finalize assertions
    softAssert.assertAll();
  });

  test('should simulate microservice failure via core-lib NetworkMocking utility', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new InvoiceDashboardPage(page);

    await loginPage.navigate();
    await loginPage.loginAs('ADMIN');
    await expect(dashboardPage.invoicesTable).toBeVisible();

    // Mock microservice 500 fault on invoice fetch
    await dashboardPage.mockServiceFailure('**/api/invoices*', 500, 'Simulated Billing Microservice Outage');

    // Trigger tab filter which causes API fetch
    await dashboardPage.filterByTab('void');
    await page.waitForTimeout(400);

    // Clear network mocks and verify dashboard recovers
    await dashboardPage.clearNetworkMocks();
    await dashboardPage.filterByTab('all');
    await expect(dashboardPage.invoicesTable).toBeVisible();
  });
});

