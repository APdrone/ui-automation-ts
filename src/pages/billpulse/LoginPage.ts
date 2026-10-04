import { Page, Locator } from '@playwright/test';
import { BasePage } from '@script-crux/adapter-playwright';

export class LoginPage extends BasePage {
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly submitButton: Locator;
  public readonly adminPersonaButton: Locator;
  public readonly managerPersonaButton: Locator;
  public readonly viewerPersonaButton: Locator;
  public readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('login-email-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-btn');
    this.adminPersonaButton = page.getByTestId('persona-admin-btn');
    this.managerPersonaButton = page.getByTestId('persona-manager-btn');
    this.viewerPersonaButton = page.getByTestId('persona-viewer-btn');
    this.errorMessage = page.getByTestId('login-error-message');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  async selectPersona(role: 'ADMIN' | 'MANAGER' | 'VIEWER'): Promise<void> {
    switch (role) {
      case 'ADMIN':
        await this.clickElement(this.adminPersonaButton, 'Admin Persona Button');
        break;
      case 'MANAGER':
        await this.clickElement(this.managerPersonaButton, 'Manager Persona Button');
        break;
      case 'VIEWER':
        await this.clickElement(this.viewerPersonaButton, 'Viewer Persona Button');
        break;
    }
  }

  async loginWithCredentials(email: string, pass: string): Promise<void> {
    await this.fillInputField(this.emailInput, email, 'Email Field');
    await this.fillInputField(this.passwordInput, pass, 'Password Field');
    await this.clickElement(this.submitButton, 'Login Submit Button');
  }

  async loginAs(role: 'ADMIN' | 'MANAGER' | 'VIEWER'): Promise<void> {
    await this.selectPersona(role);
    await this.clickElement(this.submitButton, `Login as ${role}`);
  }
}
