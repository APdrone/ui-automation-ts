import { Page, Locator } from '@playwright/test';
import { BasePage } from '@script-crux/adapter-playwright';

export interface LineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export class CreateInvoiceModalComponent extends BasePage {
  public readonly modal: Locator;
  public readonly customerNameInput: Locator;
  public readonly customerEmailInput: Locator;
  public readonly addLineItemButton: Locator;
  public readonly discountPercentageInput: Locator;
  public readonly taxRateInput: Locator;
  public readonly summarySubtotal: Locator;
  public readonly summaryDiscount: Locator;
  public readonly summaryTax: Locator;
  public readonly summaryTotal: Locator;
  public readonly submitButton: Locator;
  public readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modal = page.getByTestId('create-invoice-modal');
    this.customerNameInput = page.getByTestId('customer-name-input');
    this.customerEmailInput = page.getByTestId('customer-email-input');
    this.addLineItemButton = page.getByTestId('add-line-item-btn');
    this.discountPercentageInput = page.getByTestId('discount-percentage-input');
    this.taxRateInput = page.getByTestId('tax-rate-input');
    this.summarySubtotal = page.getByTestId('summary-subtotal');
    this.summaryDiscount = page.getByTestId('summary-discount');
    this.summaryTax = page.getByTestId('summary-tax');
    this.summaryTotal = page.getByTestId('summary-total');
    this.submitButton = page.getByTestId('submit-invoice-btn');
    this.cancelButton = page.getByTestId('cancel-create-btn');
  }

  async fillInvoiceForm(
    customerName: string,
    customerEmail: string,
    items: LineItemInput[],
    discountPercentage: number = 0,
    taxRatePercentage: number = 8.25
  ): Promise<void> {
    await this.fillInputField(this.customerNameInput, customerName, 'Customer Name');
    await this.fillInputField(this.customerEmailInput, customerEmail, 'Customer Email');

    // Fill first line item
    if (items.length > 0) {
      await this.fillInputField(this.page.getByTestId('item-desc-0'), items[0].description, 'Item 0 Description');
      await this.fillInputField(this.page.getByTestId('item-qty-0'), items[0].quantity.toString(), 'Item 0 Quantity');
      await this.fillInputField(this.page.getByTestId('item-price-0'), items[0].unitPrice.toString(), 'Item 0 Price');
    }

    // Add additional items if any
    for (let i = 1; i < items.length; i++) {
      await this.clickElement(this.addLineItemButton, 'Add Line Item Button');
      await this.fillInputField(this.page.getByTestId(`item-desc-${i}`), items[i].description, `Item ${i} Description`);
      await this.fillInputField(this.page.getByTestId(`item-qty-${i}`), items[i].quantity.toString(), `Item ${i} Quantity`);
      await this.fillInputField(this.page.getByTestId(`item-price-${i}`), items[i].unitPrice.toString(), `Item ${i} Price`);
    }

    await this.fillInputField(this.discountPercentageInput, discountPercentage.toString(), 'Discount %');
    await this.fillInputField(this.taxRateInput, taxRatePercentage.toString(), 'Tax Rate %');
  }

  async getCalculatedTotal(): Promise<string> {
    return this.getText(this.summaryTotal, 'Summary Total');
  }

  async submit(): Promise<void> {
    await this.clickElement(this.submitButton, 'Submit Invoice Button');
  }
}
