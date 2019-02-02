export default class Page {
  /**
   * define elements
   */
  get h1() {
    return $('h1').getText();
  }

  /**
   * define or overwrite page methods
   */
  open(path) {
    browser.url(path);
  }

  reload() {
    browser.reloadSession();
  }

  waitForPage(reload = false) {
    if (reload) {
      this.reload();
    }
    browser.waitUntil(
      () => {
        return (
          browser.$('.Cboard__DisplaySettings').getValue() !== 'NoSuchElement'
        );
      },
      2000,
      'App was not loaded'
    );
  }
}
