import { BaseApi } from '@script-crux/adapter-playwright';
import { PRODUCT_ENDPOINTS } from '../types/endpoints.js';

export class AuthController extends BaseApi {
  constructor(request: any) {
    super(request); // Passes the apiContext up to BaseApi cleanly
  }
  /**
   * Reusable business controller to pre-validate accounts via background APIs
   */
  async preSeedSessionToken(payload: { username: string; password: string }): Promise<void> {
    // ◀️ FIX: Call 'this.sendPost' inside the class context here!
    const response = await this.post(PRODUCT_ENDPOINTS.LOGIN, payload);

    if (!response.ok()) {
      throw new Error(`[API SEEDING FAILED]: Response returned status code ${response.status()}`);
    }
  }
}
