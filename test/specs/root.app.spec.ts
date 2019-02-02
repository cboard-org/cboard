import { expect } from 'chai';

import RootAppPage from 'test/pages/root.app.page';

describe('Root board page', function() {
  beforeEach(function() {
    RootAppPage.open();
  });

  afterEach(function() {
    browser.reloadSession();
  });

  it('should display the valid page title', function() {
    expect(RootAppPage.isRootBoard(), 'Root board not detected').to.be.true;
  });

  it('should unblock settings after 4 clicks on lock icon', function() {
    RootAppPage.unblockSettings();
    expect(RootAppPage.isSettingsDisplayed()).to.be.true;
  });

  it('should display all icons and bars after unlock', function() {
    RootAppPage.unblockSettings();
    expect(RootAppPage.isSettingsDisplayed()).to.be.true;
    expect(RootAppPage.isFullScreenDisplayed()).to.be.true;
    expect(RootAppPage.isPrintBoardisplayed()).to.be.true;
    expect(RootAppPage.isCommunicatorBarDisplayed()).to.be.true;
    expect(RootAppPage.isBoardEditBarDisplayed()).to.be.true;
  });

  it('should insert pictograms in communication bar when they are clicked', function() {
    var label = RootAppPage.clickOnRandomTileButton();
    expect(
      RootAppPage.isTileDisplayedInCommunicatorBar(label),
      'Tile not added to communication bar'
    ).to.be.true;
  });

  it('should delete pictograms when user clicks on X button', function() {
    RootAppPage.clickOnRandomTileButton();
    RootAppPage.clickOnRandomTileButton();
    RootAppPage.clickOnRandomTileButton();
    RootAppPage.clickOnRandomTileButton();
    expect(RootAppPage.countCommunicatorBarTiles()).to.equal(4);
    RootAppPage.clearCommunicatorBarTiles();
    expect(RootAppPage.countCommunicatorBarTiles()).to.equal(0);
  });
});
