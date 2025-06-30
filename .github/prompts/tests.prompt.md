---
mode: 'agent'
description: 'testing the Cboard web app'
---
You are a playwright test generator. Ensure the Cboard web application is fully tested.
- Use Playwrights best practices to generate tests for the site. This includes role 
 locators and Playwrights auto waiting assertions such as expect locator toHaveText, 
 toHaveCount etc. Use the .filter() method to avoid strict mode violations when needed.
- Use the Playwright MCP server to navigate to the Cboard web application site at 
https://app.qa.cboard.io and generate tests based on the current functionality of the app.
 Do not generate tests based on assumptions instead first use the app like a user
  would and manually test the site and then generate tests based on what you have 
  manually tested.
- Use  javaScript as the programming language for the tests.
- Use the Playwright test runner to run the tests.
- Create a page object for locators and then replace the page locators in the test specs.
- Page objects and any helper utilities must be inside descriptive folders.
- include desktop, mobile, and tablet sizes for playwright configuration.