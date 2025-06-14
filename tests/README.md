# Cboard E2E Testing with Playwright

This directory contains end-to-end tests for the Cboard AAC web application using Playwright.

## Directory Structure

### 📁 `/page-objects`

Contains Page Object Model classes that encapsulate page interactions and locators.

- **`cboard-page.js`** - Main page object for the Cboard application
- **`index.js`** - Main entry point for importing page objects

**Usage:**

```javascript
import { CboardPage } from './page-objects/cboard-page.js';
```

### 📁 `/helpers`

Contains utility functions for common test operations.

- **`overlay-utils.js`** - Functions for handling overlays and modals
- **`navigation-utils.js`** - Navigation-related helper functions
- **`communication-utils.js`** - Communication bar interaction helpers
- **`index.js`** - Main entry point for importing helpers

### 📁 `/utilities`

Contains test setup, assertions, and general utility functions.

- **`test-setup.js`** - Common test setup and configuration utilities
- **`assertions.js`** - Custom assertion helpers
- **`test-utils.js`** - General utility functions
- **`index.js`** - Main entry point for importing utilities

## Test Coverage

The test suite covers the following areas:

### 1. Basic Functionality (`basic-functionality.spec.js`)

- Main board page loading
- Communication category display
- Navigation controls
- Adding words to communication bar
- Clear and Backspace functionality

### 2. Navigation (`navigation.spec.js`)

- Category navigation (food, emotions, activities, etc.)
- Go back functionality
- Communication bar persistence across navigation
- Multi-category navigation sequences

### 3. Communication Bar (`communication-bar.spec.js`)

- Building sentences with multiple words
- Word order and removal with backspace
- Complex food-related sentences
- Negative expressions (e.g., "I dislike")
- Clear/Backspace button visibility

### 4. Security Features (`security.spec.js`)

- Unlock mechanism (3-click requirement)
- Login protection when locked
- Security message persistence across navigation

### 5. Accessibility (`accessibility.spec.js`)

- ARIA roles and labels
- Keyboard navigation
- Button activation with keyboard
- Focus management
- Proper page titles
- Disabled state handling

### 6. Mobile Responsiveness (`mobile-responsiveness.spec.js`)

- Mobile viewport compatibility
- Touch interactions
- Orientation changes (portrait/landscape)
- Tablet viewport support
- Communication bar visibility on mobile

### 7. Cross-Browser Compatibility (`cross-browser.spec.js`)

- Chrome, Firefox, Safari testing
- Consistent functionality across browsers
- Navigation and button interactions
- Communication bar behavior

## Running Tests

### Prerequisites

Make sure you have Node.js installed and run:

```bash
npm install
```

### Install Playwright Browsers

```bash
npm run test:e2e:install
```

### Run All Tests

```bash
npm run test:e2e
```

### Run Tests in Headed Mode (see browser)

```bash
npm run test:e2e:headed
```

### Debug Tests

```bash
npm run test:e2e:debug
```

### Run Tests with UI Mode

```bash
npm run test:e2e:ui
```

### View Test Report

```bash
npm run test:e2e:report
```

## Test Configuration

The tests are configured to run against `https://app.qa.cboard.io` by default. This can be modified in `playwright.config.ts`.

### Browser Support

- Chromium (Chrome)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Features

- Automatic screenshots on failure
- Video recording on failure
- Trace collection for debugging
- Parallel test execution
- Cross-browser testing

## Best Practices

The tests follow Playwright best practices:

1. **Role-based locators**: Using `getByRole()` for better accessibility testing
2. **Auto-waiting assertions**: Using `expect().toBeVisible()` and similar assertions
3. **Avoiding strict mode violations**: Using `.filter()` when needed
4. **Proper test isolation**: Each test is independent and can run in parallel
5. **Page object pattern**: Not implemented yet but recommended for larger test suites

## Test Data

The tests use the actual production-like environment at `app.qa.cboard.io` and test real user workflows:

- Communication building scenarios
- Navigation patterns
- Accessibility requirements
- Mobile usage patterns
- Security feature validation

## Continuous Integration

These tests are designed to run in CI/CD pipelines with:

- Retry mechanism for flaky tests
- Proper reporting
- Artifact collection (screenshots, videos, traces)
- Multiple browser testing

## Contributing

When adding new tests:

1. Follow the existing naming convention
2. Use descriptive test names
3. Include proper assertions
4. Test both positive and negative scenarios
5. Consider accessibility requirements
6. Test across different viewport sizes
7. Ensure tests are isolated and can run in parallel

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout in config or use more specific locators
2. **Flaky tests**: Add proper waits and use more reliable locators
3. **Cross-browser failures**: Check for browser-specific behaviors
4. **Mobile test failures**: Verify touch interactions and viewport settings

### Debug Tips

1. Use `--headed` mode to see what's happening
2. Use `--debug` mode to step through tests
3. Add `await page.pause()` to stop execution at specific points
4. Check the test report for screenshots and traces
5. Use browser developer tools in headed mode

## Future Enhancements

Potential areas for test expansion:

1. **Speech functionality testing** (if TTS can be tested)
2. **User authentication flows** (login/logout)
3. **Settings and preferences**
4. **Board customization features**
5. **Offline functionality**
6. **Performance testing**
7. **Visual regression testing**
