import randomstring from 'randomstring';

import WelcomeAppPage from 'pages/welcome.app.page';

describe('Welcome page', function() {
  beforeEach(function() {
    WelcomeAppPage.open();
  });

  afterEach(function() {
    browser.reloadSession();
  });

  it('should successfully login a valid user', function() {
    WelcomeAppPage.loginUser('anything@cboard.io', '1122');
  });

  it('should reject a login with an invalid user', function() {
    WelcomeAppPage.loginUser('nothing@cboard.io', '1122', true);
  });

  it('should skip login when user presses on skip button', function() {
    WelcomeAppPage.loginSkip();
  });

  it('should successfully signup a valid user', function() {
    var newUser =
      randomstring.generate({
        length: 16,
        charset: 'alphabetic'
      }) + '@cboard.io';
    WelcomeAppPage.signupUser(newUser, newUser, '1122');
  });
});
