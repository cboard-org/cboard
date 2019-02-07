import { assert } from 'chai';

import HomePage from 'pages/home.site.page';

describe('cboard.io page', function() {
  it('should have the right title', function() {
    HomePage.open();
    var title = browser.getTitle();
    assert.equal(title, 'Home | Cboard - Communication Board');
  });

  it('should open the app', function() {
    HomePage.open();
    HomePage.clickOnStartCboard();
    var title = browser.getTitle();
    assert.equal(title, 'Cboard - AAC Communication Board');
  });
});
