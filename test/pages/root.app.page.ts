import { assert } from 'chai';
import { expect } from 'chai';
var rn = require('random-number');

import Page from 'test/pages/Page';
import WelcomeAppPage from 'test/pages/welcome.app.page';

class RootAppPage extends Page {
  /**
   * define elements
   */
  get rootboard() {
    return $('h2=home');
  }
  get unlock() {
    return $('//button[@aria-label="Unlock"]');
  }
  get lock() {
    return $('//button[@aria-label="Lock"]');
  }
  get createTiles() {
    return $('//button[@aria-label="Create tiles"]');
  }
  get tile() {
    return $('//div[@class="Symbol"]');
  }
  get tileButton() {
    return $$('//button[@class="Tile"]');
  }
  get settings() {
    return $('//*[@aria-label="Settings"]');
  }
  get fullScreen() {
    return $('//*[@aria-label="Full screen"]');
  }
  get communicatorBar() {
    return $('.CommunicatorToolbar.Board__communicator-toolbar');
  }
  get boardEditBar() {
    return $('.EditToolbar.Board__edit-toolbar');
  }
  get tilesInCommunicator() {
    return $$('div.SymbolOutput__value');
  }
  get clear() {
    return $('//*[@aria-label="Clear"]');
  }
  get printBoard() {
    return $('//*[@aria-label="Print Board"]');
  }
  /**
   * define or overwrite page methods
   */
  open() {
    super.open('https://app.cboard.io/');
    WelcomeAppPage.loginUser('anything@cboard.io', '1122');
  }

  checkTitle() {
    var title = browser.getTitle();
    assert.equal(title, 'Cboard - AAC Communication Board');
  }

  isRootBoard() {
    return this.rootboard.waitForDisplayed(5000);
  }

  unblockSettings() {
    expect(this.lock.isDisplayed()).to.be.false;
    this.unlock.click();
    browser.pause(600);
    this.unlock.click();
    browser.pause(600);
    this.unlock.click();
    browser.pause(600);
    this.unlock.click();
    browser.pause(600);
    expect(this.lock.isDisplayed()).to.be.true;
  }

  clickOnCreateTiles() {
    this.createTiles.click();
  }

  isTileDisplayed(label) {
    return $(
      '//div[@class="Symbol"]//div[text()="' + label + '"]'
    ).isDisplayed();
  }

  isSettingsDisplayed() {
    return this.settings.isDisplayed();
  }

  isFullScreenDisplayed() {
    return this.fullScreen.isDisplayed();
  }

  isPrintBoardisplayed() {
    return this.printBoard.isDisplayed();
  }

  isCommunicatorBarDisplayed() {
    return this.communicatorBar.isDisplayed();
  }

  isBoardEditBarDisplayed() {
    return this.boardEditBar.isDisplayed();
  }

  isTileDisplayedInCommunicatorBar(label) {
    return $(
      '//div[@class="SymbolOutput"]//div[@class="Symbol__label" and text()="' +
        label +
        '"]'
    ).isDisplayed();
  }

  clickOnRandomTileButton() {
    this.tile.waitForDisplayed(4000);
    var length = this.tileButton.length;
    var options = {
      min: 0,
      max: length - 1,
      integer: true
    };
    var index = rn(options);
    $$('//button[@class="Tile"]')[index].click();
    return $$('//button[@class="Tile"]')[index].getText();
  }

  countCommunicatorBarTiles() {
    return this.tilesInCommunicator.length;
  }

  clearCommunicatorBarTiles() {
    return this.clear.click();
  }

  clickOnSetttings() {
    return this.settings.click();
  }
}

export default new RootAppPage();
