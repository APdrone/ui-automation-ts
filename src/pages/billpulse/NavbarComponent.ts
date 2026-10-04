import { Page, Locator } from '@playwright/test';
import { BasePage } from '@script-crux/adapter-playwright';

export class NavbarComponent extends BasePage {
  public readonly navbar: Locator;
  public readonly sseStatusIndicator: Locator;
  public readonly userRoleBadge: Locator;
  public readonly resetStateButton: Locator;
  public readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar = page.getByTestId('app-navbar');
    this.sseStatusIndicator = page.getByTestId('sse-status-indicator');
    this.userRoleBadge = page.getByTestId('current-user-role');
    this.resetStateButton = page.getByTestId('reset-state-btn');
    this.logoutButton = page.getByTestId('logout-btn');
  }

  async getUserRole(): Promise<string> {
    return this.getText(this.userRoleBadge, 'User Role Badge');
  }

  async resetState(): Promise<void> {
    await this.clickElement(this.resetStateButton, 'Reset State Button');
  }

  async logout(): Promise<void> {
    await this.clickElement(this.logoutButton, 'Logout Button');
  }
}
