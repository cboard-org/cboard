import { expect } from 'chai';

import Page from 'test/pages/Page';
import RootAppPage from 'test/pages/root.app.page';
import WelcomeAppPage from 'test/pages/welcome.app.page';

class CreatePictoAppPage extends Page {
  /**
   * define elements
   */
  get pageH6() {
    return $('h6=Create tile');
  }
  get folder() {
    return $('//input[@value="folder"]');
  }
  get button() {
    return $('//input[@value="button"]');
  }
  get nameInput() {
    return $('//*[@name="name"]');
  }
  get labelInput() {
    return $('#label');
  }
  get vocalizationInput() {
    return $('#vocalization');
  }
  get saveButton() {
    return $('span=Save');
  }
  /**
   * define or overwrite page methods
   */
  open() {
    super.open('https://app.cboard.io/');
    WelcomeAppPage.loginUser('anything@cboard.io', '1122');
    RootAppPage.unblockSettings();
    RootAppPage.clickOnCreateTiles();
    expect(this.pageH6.isDisplayed()).to.be.true;
  }

  reload() {
    super.reload();
  }

  createPicto(label, vocalization, type = 'button') {
    this.labelInput.setValue(label);
    this.vocalizationInput.setValue(vocalization);

    if (type === 'folder') {
      this.folder.click();
    }
    this.saveButton.click();
  }
}

export default new CreatePictoAppPage();
