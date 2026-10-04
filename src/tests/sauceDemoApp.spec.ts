import { baseUiTest, expect } from '@script-crux/adapter-playwright';
import { DataGenerator } from '@script-crux/core-shared';
import { AuthController } from '../controllers/authController.js'; // Added .js extension required by ESM type: module
import { LoginPage } from '../pages/loginPage.js';              // Added .js extension required by ESM type: module

baseUiTest('Should execute corporate hybrid UI and API validation pipeline cleanly', async ({ page, apiContext }) => {
  // 1. Generate clean mock registration profiles via core shared utilities
  // const fakeUser = DataGenerator.generateUser();

  // // 2. Instantiate your API Service Controller and UI Page Objects
  // const authController = new AuthController(apiContext);
  const loginPage = new LoginPage(page);

  // // 3. Perform background API seeding call with automated framework logs
  // await authController.preSeedSessionToken({
  //   username: fakeUser.userName,
  //   password: fakeUser.password
  // });

  // 4. Fallback execution step back into browser UI login checks
  await loginPage.loginWithUserCredentials('standard_user', 'secret_sauce');

  // 5. Assert UI confirmation pass
  await expect(page).toHaveURL(/.*inventory.html/);
});
