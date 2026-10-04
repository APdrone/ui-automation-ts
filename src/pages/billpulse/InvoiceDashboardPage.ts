import { Page, Locator } from '@playwright/test';
import { BasePage } from '@script-crux/adapter-playwright';
import { NavbarComponent } from './NavbarComponent.js';
import { CreateInvoiceModalComponent } from './CreateInvoiceModalComponent.js';

export class InvoiceDashboardPage extends BasePage {
  public readonly navbar: NavbarComponent;
  public readonly createModal: CreateInvoiceModalComponent;
  public readonly createInvoiceButton: Locator;
  public readonly searchInput: Locator;
  public readonly exportCsvButton: Locator;
  public readonly downloadCsvButton: Locator;
  public readonly invoicesTable: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar = new NavbarComponent(page);
    this.createModal = new CreateInvoiceModalComponent(page);
    this.createInvoiceButton = page.getByTestId('create-invoice-btn');
    this.searchInput = page.getByTestId('search-invoices-input');
    this.exportCsvButton = page.getByTestId('export-csv-btn');
    this.downloadCsvButton = page.getByTestId('download-csv-btn');
    this.invoicesTable = page.getByTestId('invoices-table');
  }

  async filterByTab(tab: 'all' | 'paid' | 'pending' | 'processing' | 'draft' | 'void'): Promise<void> {
    const tabLocator = this.page.getByTestId(`filter-tab-${tab}`);
    await this.clickElement(tabLocator, `Filter Tab [${tab}]`);
  }

  async search(query: string): Promise<void> {
    await this.fillInputField(this.searchInput, query, 'Search Input');
  }

  async openCreateInvoiceModal(): Promise<void> {
    await this.clickElement(this.createInvoiceButton, 'Create Invoice Button');
  }

  async getInvoiceRow(id: string): Locator {
    return this.page.getByTestId(`invoice-row-${id}`);
  }

  async clickSubmitOnRow(id: string): Promise<void> {
    const btn = this.page.getByTestId(`submit-btn-${id}`);
    await this.clickElement(btn, `Submit Button for ${id}`);
  }

  async clickPayOnRow(id: string): Promise<void> {
    const btn = this.page.getByTestId(`pay-btn-${id}`);
    await this.clickElement(btn, `Pay Button for ${id}`);
  }

  async clickVoidOnRow(id: string): Promise<void> {
    const btn = this.page.getByTestId(`void-btn-${id}`);
    await this.clickElement(btn, `Void Button for ${id}`);
  }
}
