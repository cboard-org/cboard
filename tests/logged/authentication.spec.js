import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Authentication', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
  });
  test.describe('Login Functionality', () => {
    test.beforeEach(async () => {
      await cboard.gotoLoginSignup();
    });
    test('should display login form when Login button is clicked', async () => {
      await cboard.openLoginDialog();
      await cboard.expectLoginFormVisible();
    });
    test.skip('should show/hide password when toggle button is clicked', async () => {
      await cboard.openLoginDialog();
      await cboard.expectPasswordFieldType('login', 'password');
      await cboard.togglePasswordVisibility();
      await cboard.expectPasswordFieldType('login', 'text');
    });
    test('should validate empty email and password fields', async () => {
      await cboard.openLoginDialog();
      await cboard.submitLoginForm();
      await cboard.expectRequiredFields();
    });
    test.skip('should handle invalid email format', async () => {
      await cboard.attemptLogin('invalid-email', 'password123');

      await cboard.expectEmailValidation();
    });

    test.skip('should handle invalid credentials', async () => {
      await cboard.attemptLogin('invalid@example.com', 'wrongpassword');

      await cboard.page.waitForTimeout(2000);

      expect(cboard.page.url()).toContain('/login-signup');
    });

    test('should close login dialog when Cancel is clicked', async () => {
      await cboard.openLoginDialog();
      await cboard.closeLoginDialog();
    });
  });

  test.describe('Sign Up Functionality', () => {
    test.beforeEach(async () => {
      await cboard.gotoLoginSignup();
    });

    test('should display signup form when Sign Up button is clicked', async () => {
      await cboard.openSignUpDialog();

      await cboard.expectSignUpFormVisible();
    });

    test.skip('should validate password confirmation', async () => {
      await cboard.attemptSignUp(
        'Test User',
        'test@example.com',
        'password123',
        'password456'
      );

      await cboard.page.waitForTimeout(1000);

      await expect(cboard.signUpDialog).toBeVisible();
    });

    test.skip('should require terms and conditions agreement', async () => {
      await cboard.openSignUpDialog();
      await cboard.fillSignUpForm(
        'Test User',
        'test@example.com',
        'password123',
        'password123',
        false
      );

      await cboard.submitSignUpForm();

      await cboard.expectTermsRequired();
    });
    test.skip('should show/hide password fields', async () => {
      await cboard.openSignUpDialog();

      await cboard.expectPasswordFieldType('create', 'password');
      await cboard.expectPasswordFieldType('confirm', 'password');

      await cboard.togglePasswordVisibility();
    });

    test('should close signup dialog when Cancel is clicked', async () => {
      await cboard.openSignUpDialog();
      await cboard.closeSignUpDialog();
    });
  });

  test.describe('Password Reset Functionality', () => {
    test.beforeEach(async () => {
      await cboard.gotoLoginSignup();
    });

    test('should display password reset form when Forgot password is clicked', async () => {
      await cboard.openPasswordResetDialog();

      await cboard.expectPasswordResetFormVisible();
    });
    test('should validate email format in password reset', async () => {
      await cboard.openPasswordResetDialog();

      await cboard.passwordResetEmailField.fill('invalid-email');

      await cboard.passwordResetSendButton.click({ timeout: 10000 });

      await expect(cboard.passwordResetDialog).toBeVisible();
    });

    test('should handle password reset request', async () => {
      await cboard.requestPasswordReset('test@example.com');

      await cboard.page.waitForTimeout(2000);
    });

    test('should close password reset dialog when Cancel is clicked', async () => {
      await cboard.openPasswordResetDialog();
      await cboard.closePasswordResetDialog();
    });
  });

  test.describe('Social Authentication', () => {
    test.beforeEach(async () => {
      await cboard.gotoLoginSignup();
    });

    test('should display social login options', async () => {
      await cboard.expectSocialLoginButtonsVisible();
    });

    test('should handle Google sign in click', async () => {
      const navigationPromise = cboard.page
        .waitForNavigation({ timeout: 5000 })
        .catch(() => null);

      await cboard.clickSocialLogin('google');

      await navigationPromise;
    });

    test('should handle Facebook sign in click', async () => {
      const navigationPromise = cboard.page
        .waitForNavigation({ timeout: 5000 })
        .catch(() => null);

      await cboard.clickSocialLogin('facebook');

      await navigationPromise;
    });

    test('should handle Apple sign in click', async () => {
      const navigationPromise = cboard.page
        .waitForNavigation({ timeout: 5000 })
        .catch(() => null);

      await cboard.clickSocialLogin('apple');

      await navigationPromise;
    });
  });

  test.describe('General UI Elements', () => {
    test.beforeEach(async () => {
      await cboard.gotoLoginSignup();
    });

    test('should display Cboard logo and branding', async () => {
      await cboard.expectAuthenticationPageElements();

      await expect(cboard.page).toHaveTitle('Cboard - AAC Communication Board');
    });

    test('should display privacy policy and terms links', async () => {
      await cboard.expectPrivacyPolicyLink();
      await cboard.expectTermsLink();
    });

    test('should handle close button functionality', async () => {
      await cboard.expectButtonVisible(cboard.closeButton);

      await cboard.safeClick(cboard.closeButton);
    });
  });
});
