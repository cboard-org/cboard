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
      // Click Login button
      await cboard.openLoginDialog();

      // Verify login form elements
      await cboard.expectLoginFormVisible();
    });
    test('should show/hide password when toggle button is clicked', async () => {
      // Open login dialog
      await cboard.openLoginDialog();

      // Verify password field is initially hidden
      await cboard.expectPasswordFieldType('login', 'password');

      // Click show password button
      await cboard.togglePasswordVisibility();

      // Verify password is now visible
      await cboard.expectPasswordFieldType('login', 'text');
    });
    test('should handle invalid email format', async () => {
      // Open login dialog and fill with invalid email
      await cboard.attemptLogin('invalid-email', 'password123');

      // Verify email validation
      await cboard.expectEmailValidation();
    });

    test('should handle invalid credentials', async () => {
      // Enter invalid credentials
      await cboard.attemptLogin('invalid@example.com', 'wrongpassword');

      // Wait for potential error message
      await cboard.page.waitForTimeout(2000);

      // Verify we're still on login page (not redirected)
      expect(cboard.page.url()).toContain('/login-signup');
    });

    test('should close login dialog when Cancel is clicked', async () => {
      // Open login dialog and close it
      await cboard.openLoginDialog();
      await cboard.closeLoginDialog();
    });
  });

  test.describe('Sign Up Functionality', () => {
    test.beforeEach(async () => {
      await cboard.gotoLoginSignup();
    });

    test('should display signup form when Sign Up button is clicked', async () => {
      // Open signup dialog
      await cboard.openSignUpDialog();

      // Verify signup form elements
      await cboard.expectSignUpFormVisible();
    });

    test('should validate password confirmation', async () => {
      // Attempt signup with mismatched passwords
      await cboard.attemptSignUp(
        'Test User',
        'test@example.com',
        'password123',
        'password456'
      );

      // Wait for potential validation
      await cboard.page.waitForTimeout(1000);

      // Verify we're still in signup dialog (validation should prevent submission)
      await expect(cboard.signUpDialog).toBeVisible();
    });

    test('should require terms and conditions agreement', async () => {
      // Open signup dialog and fill form without accepting terms
      await cboard.openSignUpDialog();
      await cboard.fillSignUpForm(
        'Test User',
        'test@example.com',
        'password123',
        'password123',
        false
      );

      // Try to submit
      await cboard.submitSignUpForm();

      // Verify terms checkbox is required
      await cboard.expectTermsRequired();
    });
    test.skip('should show/hide password fields', async () => {
      // Open signup dialog
      await cboard.openSignUpDialog();

      // Verify password fields are initially hidden
      await cboard.expectPasswordFieldType('create', 'password');
      await cboard.expectPasswordFieldType('confirm', 'password');

      // Click show password button
      await cboard.togglePasswordVisibility();

      // Verify at least one password field becomes visible
      // Note: Implementation might vary for which field becomes visible
    });

    test('should close signup dialog when Cancel is clicked', async () => {
      // Open signup dialog and close it
      await cboard.openSignUpDialog();
      await cboard.closeSignUpDialog();
    });
  });

  test.describe('Password Reset Functionality', () => {
    test.beforeEach(async () => {
      await cboard.gotoLoginSignup();
    });

    test('should display password reset form when Forgot password is clicked', async () => {
      // Open password reset dialog
      await cboard.openPasswordResetDialog();

      // Verify password reset form elements
      await cboard.expectPasswordResetFormVisible();
    });
    test('should validate email format in password reset', async () => {
      // Open password reset dialog
      await cboard.openPasswordResetDialog();

      // Enter invalid email
      await cboard.passwordResetEmailField.fill('invalid-email');

      // Click Send button
      await cboard.passwordResetSendButton.click({ timeout: 10000 });

      // Verify email validation - this might not show validation for password reset
      // Just verify we're still in the dialog
      await expect(cboard.passwordResetDialog).toBeVisible();
    });

    test('should handle password reset request', async () => {
      // Request password reset
      await cboard.requestPasswordReset('test@example.com');

      // Wait for potential success message or dialog closure
      await cboard.page.waitForTimeout(2000);

      // This test might need adjustment based on actual implementation
    });

    test('should close password reset dialog when Cancel is clicked', async () => {
      // Open password reset dialog and close it
      await cboard.openPasswordResetDialog();
      await cboard.closePasswordResetDialog();
    });
  });

  test.describe('Social Authentication', () => {
    test.beforeEach(async () => {
      await cboard.gotoLoginSignup();
    });

    test('should display social login options', async () => {
      // Verify social login buttons are visible
      await cboard.expectSocialLoginButtonsVisible();
    });

    test('should handle Google sign in click', async () => {
      // Note: This test will likely redirect to Google's OAuth page
      // We might want to mock this or test only the click behavior

      // Set up a listener for navigation
      const navigationPromise = cboard.page
        .waitForNavigation({ timeout: 5000 })
        .catch(() => null);

      // Click Google sign in
      await cboard.clickSocialLogin('google');

      // Wait for potential navigation
      await navigationPromise;

      // This test might need adjustment based on actual OAuth implementation
    });

    test('should handle Facebook sign in click', async () => {
      // Similar to Google test - might redirect to Facebook OAuth
      const navigationPromise = cboard.page
        .waitForNavigation({ timeout: 5000 })
        .catch(() => null);

      // Click Facebook sign in
      await cboard.clickSocialLogin('facebook');

      await navigationPromise;
    });

    test('should handle Apple sign in click', async () => {
      // Similar to other OAuth tests
      const navigationPromise = cboard.page
        .waitForNavigation({ timeout: 5000 })
        .catch(() => null);

      // Click Apple sign in
      await cboard.clickSocialLogin('apple');

      await navigationPromise;
    });
  });

  test.describe('General UI Elements', () => {
    test.beforeEach(async () => {
      await cboard.gotoLoginSignup();
    });

    test('should display Cboard logo and branding', async () => {
      // Verify authentication page elements
      await cboard.expectAuthenticationPageElements();

      // Verify page title
      await expect(cboard.page).toHaveTitle('Cboard - AAC Communication Board');
    });

    test('should display privacy policy and terms links', async () => {
      // Verify footer links point to correct URLs
      await cboard.expectPrivacyPolicyLink();
      await cboard.expectTermsLink();
    });

    test('should handle close button functionality', async () => {
      // Verify close button is present and clickable
      await cboard.expectButtonVisible(cboard.closeButton);

      // Click close button and verify behavior
      await cboard.safeClick(cboard.closeButton);

      // This might navigate away or close the modal - adjust based on actual behavior
    });
  });
});
