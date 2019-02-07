import Page from 'pages/Page';

class HomePage extends Page {
  /**
   * define elements
   **/
  get startCboard() {
    return browser.$('=Start Cboard');
  }
  get blog() {
    return browser.$('=BLOG');
  }
  get about() {
    return browser.$('=ABOUT');
  }
  get contact() {
    return browser.$('=CONTACT');
  }
  get help() {
    return browser.$('=HELP');
  }
  get github() {
    return browser.$('=GITHUB');
  }

  /**
   * define or overwrite page methods
   */
  open() {
    super.open('https://www.cboard.io/');
  }

  clickOnStartCboard() {
    this.startCboard.click();
  }

  clickOnBlogMenuItem() {
    this.blog.click();
  }

  clickOnAboutMenuItem() {
    this.about.click();
  }

  clickOnContactMenuItem() {
    this.contact.click();
  }

  clickOnHelpMenuItem() {
    this.help.click();
  }

  clickOnGithubMenuItem() {
    this.github.click();
  }
}

export default new HomePage();
