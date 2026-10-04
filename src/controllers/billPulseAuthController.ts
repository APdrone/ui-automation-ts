import { Page } from '@playwright/test';
import { BaseApi } from '@script-crux/adapter-playwright';

export class BillPulseAuthController extends BaseApi {
  constructor(request: any) {
    super(request);
  }

  /**
   * Performs fast API authentication via the Gateway / Auth Service
   * and injects the session token into browser localStorage.
   */
  async preSeedAuthSession(
    page: Page,
    email: string = 'admin@billpulse.io',
    password: string = 'Password123!'
  ): Promise<string> {
    const response = await this.post('/api/auth/login', { email, password });

    if (!response.ok()) {
      throw new Error(`[API Pre-seeding Failed]: Status ${response.status()}`);
    }

    const data = await response.json();
    const token = data.token;

    // Inject token directly into browser storage to bypass UI login form
    await page.addInitScript((jwtToken: string) => {
      window.localStorage.setItem('billpulse_token', jwtToken);
    }, token);

    return token;
  }
}
