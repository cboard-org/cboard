# Cboard E2E Testing with Playwright

This directory contains end-to-end tests for the Cboard AAC web application using Playwright.

## Directory Structure

### 📁 `/page-objects`

Contains sophisticated Page Object Model classes that encapsulate page interactions, locators, and workflows.

- **`cboard.js`** - Comprehensive page object for the Cboard application with 2800+ lines of methods and locators
- **`index.js`** - Main entry point for importing page objects

**Key Features:**

- **Comprehensive Locators** - 200+ UI element selectors organized by functionality
- **Workflow Methods** - Complete automation workflows for complex user tasks
- **Settings Management** - Full coverage of all settings categories and options
- **Export/Import Workflows** - Complete file operations with verification
- **Navigation Utilities** - Robust navigation with overlay and tour handling
- **Error Handling** - Graceful handling of UI overlays, timeouts, and edge cases

**Core Method Categories:**

```javascript
// Navigation and Basic Operations
await cboard.goto();
await cboard.navigateToSettings();
await cboard.clickUnlock(); // 4-click unlock sequence

// Display Settings Automation
await cboard.selectFontSize('Large');
await cboard.selectFontFamily('Roboto');
await cboard.toggleOutputBarVisibility();
await cboard.verifyDisplayChanges();

// Export Workflows
await cboard.selectBoard('Cboard Classic Home');
await cboard.exportSingleBoardAsPDF();
await cboard.verifyExportSuccess();

// Communication and Navigation
await cboard.addWordToCommunicationBar('food');
await cboard.navigateToCategory('emotions');
await cboard.verifyBoardContent();
```

**Usage:**

```javascript
import { createCboard } from './page-objects/cboard.js';
const cboard = createCboard(page);
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

### 📁 `/unlogged/settings`

Contains tests for user settings and display preferences when not logged in:

- **`display.spec.js`** - Comprehensive display settings tests including UI Size, Font Family, Font Size, and Output Bar Visibility
- **`export.spec.js`** - Export settings tests including single board export, all boards export, format selection (PDF, Cboard, OpenBoard), and PDF settings
- **`import.spec.js`** - Import settings tests for board and configuration imports
- **`language.spec.js`** - Language and localization settings tests
- **`scanning.spec.js`** - Scanning and accessibility navigation settings tests
- **`speech.spec.js`** - Text-to-speech and voice settings tests
- **`symbols.spec.js`** - Symbol set and library configuration tests

### 📁 `/unlogged`

Contains tests for non-authenticated user functionality:

- **`accessibility.spec.js`** - ARIA roles, labels, keyboard navigation, and accessibility compliance tests
- **`basic-functionality.spec.js`** - Core functionality tests including board loading, category display, and communication bar basics
- **`communication-bar.spec.js`** - Communication sentence building, word management, and output functionality tests
- **`mobile-responsiveness.spec.js`** - Mobile viewport compatibility, touch interactions, and responsive design tests
- **`navigation.spec.js`** - Category navigation, board traversal, and navigation control tests
- **`unlock.spec.js`** - Advanced feature unlock mechanism and security tests

### 📁 `/logged`

Contains tests for authenticated user functionality:

- **`authentication.spec.js`** - Login, logout, and user session management tests

### 📁 Root Level

- **`smoke.spec.js`** - Quick smoke tests for critical functionality

#### Display Settings Automation

The display settings tests fully automate comprehensive workflows:

1. **Navigation** - Access Settings → Display tab
2. **UI Size Changes** - Test different UI sizes (Standard, Large, Extra Large)
3. **Font Family Selection** - Test font family changes (OpenDyslexic, Roboto, etc.)
4. **Font Size Modification** - Confirm available font sizes and apply changes
5. **Output Bar Visibility** - Toggle communication bar visibility on/off
6. **Dark Theme Support** - Test theme switching and persistence
7. **Settings Persistence** - Save settings and verify changes are applied across navigation
8. **UI Verification** - Confirm changes are reflected in the main board interface

**Key Features:**

- Complete display customization workflow automation
- Real-time UI change verification
- Settings persistence testing across page reloads
- Accessibility compliance validation

#### Export Settings Automation

The export settings tests fully automate board export workflows:

1. **Navigation** - Access Settings → Export tab
2. **Single Board Export** - Select specific boards for export
3. **Export Format Selection** - Choose between Cboard, OpenBoard, and PDF formats
4. **PDF Export Workflow** - Complete PDF generation and download verification
5. **All Boards Export** - Bulk export functionality testing
6. **PDF Settings Configuration** - Font size and formatting options
7. **Export Success Verification** - Confirm successful downloads and file generation

**Export Formats Supported:**

- **Cboard Format** - Native Cboard board files
- **OpenBoard Format** - OpenBoard-compatible exports
- **PDF Format** - Printable PDF board layouts
- **PicseePal PDF** - Specialized PDF format for PicseePal compatibility

**Page Object Methods:**

- `selectBoard()` - Chooses specific board for export
- `selectExportFormat()` - Selects export format type
- `exportSingleBoardAsPDF()` - Complete PDF export workflow
- `verifyExportSuccess()` - Confirms successful export completion
- `verifyExportSettingsUI()` - Validates export interface elements

## Test Coverage

The test suite provides comprehensive coverage across the following areas:

### 1. Basic Functionality (`basic-functionality.spec.js`)

- Main board page loading and rendering
- Communication category display and organization
- Navigation controls functionality
- Adding words to communication bar
- Clear and Backspace functionality
- Core user interaction workflows

### 2. Navigation (`navigation.spec.js`)

- Category navigation (food, emotions, activities, etc.)
- Go back functionality and breadcrumb navigation
- Communication bar persistence across navigation
- Multi-category navigation sequences
- Board traversal and state management

### 3. Communication Bar (`communication-bar.spec.js`)

- Building sentences with multiple words
- Word order management and removal with backspace
- Complex food-related sentences and expressions
- Negative expressions (e.g., "I dislike")
- Clear/Backspace button visibility and functionality
- Sentence construction workflows

### 4. Security Features (`unlock.spec.js`)

- Unlock mechanism (4-click requirement for advanced features)
- Settings access protection when locked
- Security message persistence across navigation
- Advanced feature gating and access control

### 5. Accessibility (`accessibility.spec.js`)

- ARIA roles and labels validation
- Keyboard navigation and accessibility
- Button activation with keyboard inputs
- Focus management and tab order
- Proper page titles and semantic structure
- Disabled state handling and screen reader support

### 6. Mobile Responsiveness (`mobile-responsiveness.spec.js`)

- Mobile viewport compatibility testing
- Touch interactions and gesture support
- Orientation changes (portrait/landscape)
- Tablet viewport support and optimization
- Communication bar visibility and usability on mobile devices
- Responsive design validation

### 7. Display Settings (`settings/display.spec.js`)

- UI size modifications (Standard, Large, Extra Large)
- Font family selection and application
- Font size adjustments and persistence
- Output bar visibility toggles
- Dark theme support and theme switching
- Settings persistence across sessions
- Real-time UI change verification

### 8. Export Settings (`settings/export.spec.js`)

- Single board export workflows
- Multiple export format support (Cboard, OpenBoard, PDF)
- PDF generation and download verification
- All boards bulk export functionality
- PDF settings and formatting options
- Export success confirmation and file validation

### 9. Import Settings (`settings/import.spec.js`)

- Board import functionality
- Configuration file imports
- Import format validation
- Error handling for invalid files

### 10. Language Settings (`settings/language.spec.js`)

- Language selection and switching
- Localization testing
- RTL (Right-to-Left) language support
- Language persistence across sessions

### 11. Speech Settings (`settings/speech.spec.js`)

- Text-to-speech configuration
- Voice selection and settings
- Speech rate and pitch adjustments
- Audio output testing

### 12. Scanning Settings (`settings/scanning.spec.js`)

- Switch scanning configuration
- Accessibility navigation settings
- Timing and delay adjustments
- Scan pattern customization

### 13. Symbols Settings (`settings/symbols.spec.js`)

- Symbol set selection and management
- Symbol library configuration
- Custom symbol uploads
- Symbol display preferences

### 14. Authentication (`logged/authentication.spec.js`)

- User login and logout workflows
- Session management
- User profile access
- Authenticated feature testing

### 15. Smoke Tests (`smoke.spec.js`)

- Critical path validation
- Quick functionality verification
- Deployment validation tests
- Essential feature smoke testing

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

## Current Achievements

The test suite has achieved comprehensive automation across all major Cboard functionality:

✅ **Complete Settings Automation** - All settings categories fully automated with verification
✅ **Export/Import Workflows** - PDF generation, board exports, and file operations
✅ **Display Customization** - Font sizes, themes, UI scaling, and output bar management
✅ **Robust Page Object Model** - 2800+ lines of reusable methods and locators
✅ **Cross-Browser Compatibility** - Chrome, Firefox, WebKit support
✅ **Mobile Responsiveness** - Touch interactions and responsive design validation
✅ **Accessibility Compliance** - ARIA, keyboard navigation, and screen reader support
✅ **Communication Workflows** - Sentence building and output functionality
✅ **Security Features** - Unlock mechanisms and feature gating
✅ **Navigation Testing** - Category traversal and state management

## Future Enhancements

Potential areas for continued test expansion:

### 1. Advanced Features

- **Speech functionality testing** - TTS voice testing and audio output validation
- **Board customization features** - Custom board creation and editing workflows
- **Symbol management** - Custom symbol uploads and library management
- **User-generated content** - Custom categories and personalized boards

### 2. Performance & Reliability

- **Performance testing** - Load times, rendering performance, and responsiveness metrics
- **Visual regression testing** - Screenshot comparison and UI consistency validation
- **Offline functionality** - PWA capabilities and offline mode testing
- **Network conditions** - Slow/unstable network simulation

### 3. Integration & API Testing

- **Backend API testing** - User data persistence and synchronization
- **Cloud storage integration** - Board backup and restore functionality
- **Multi-device synchronization** - Cross-device user experience testing
- **Third-party integrations** - External service connections and imports

### 4. User Experience

- **User journey testing** - Complete end-to-end user workflows
- **Onboarding flows** - New user experience and tutorial testing
- **Error recovery** - Graceful error handling and user guidance
- **Advanced accessibility** - Screen reader compatibility and motor accessibility

### 5. Data & Analytics

- **Usage analytics testing** - Event tracking and user behavior analysis
- **Data export/import** - Advanced data management workflows
- **Backup and restore** - User data protection and recovery testing
- **Privacy compliance** - GDPR and data protection validation
