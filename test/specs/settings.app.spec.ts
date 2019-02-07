import SettingsPage from 'pages/settings.app.page';
import RootAppPage from 'pages/root.app.page';

describe('Import board option', function() {
  beforeEach(function() {
    RootAppPage.open();
  });

  afterEach(function() {
    browser.reloadSession();
  });
  it('should import and immediately display the board', function() {});
});

describe('Export board option', function() {
  beforeEach(function() {
    RootAppPage.open();
  });

  afterEach(function() {
    browser.reloadSession();
  });

  it('should download the root board as a cboard json file', function() {
    SettingsPage.clickOnExport();
    SettingsPage.exportBoard();
  });

  it('should download the root board as OBZ file', function() {});
  it('should download the root board as OBF file', function() {});
});
