#### Note

Still in alpha stage.

# Cboard - AAC Communication Board for the Browser

[Cboard](https://shayc.github.io/cboard) is an augmentative and alternative communication (AAC) web application, allowing those with speech and language impairments (autism, cerebral palsy) to communicate by symbols and text-to-speech.

The app uses the browser's Speech Synthesis API to generate speech when a symbol is clicked, there are 3400 symbols to choose from when creating a new board. The app supports 33 languages (support varies by platform - Android, iOS, Windows).

**We're using Discord to collaborate, join us at: https://discord.gg/TEH8uxh**

### `npm start` or `yarn start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will see the build errors and lint warnings in the console.

### `npm test` or `yarn test`

Runs the test watcher in an interactive mode.<br>
By default, runs tests related to files changed since the last commit.

[Read more about testing.](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests)

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
By default, it also [includes a service worker](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#making-a-progressive-web-app) so that Cboard loads from local cache on future visits.

Cboard is ready to be deployed.

## Translations

The app supports 33 languages.
Languages were machine translated, as far as I'm aware, they are mostly correct but require proofreading, if you want to help proofread click this link: https://crowdin.com/project/cboard - you do not need to be a programmer to do this!

## Thanks

[Straight Street](http://straight-street.com/gallery.php) - for providing the symbols.  
[Crowdin](https://crowdin.com/) - for providing the localization management platform.  
[<img src="https://www.browserstack.com/images/mail/browserstack-logo-footer.png" width="120" alt="Live, web-based browser testing">](https://www.browserstack.com/)  
Thank you to BrowserStack for providing the infrastructure to test Cboard in real browsers.  

[<img src="https://cdn.auth0.com/oss/badges/a0-badge-light.png" width="150" height="50" alt="JWT Auth for open source projects">](https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss)  
Thank you to Auth0 for providing the token based authentication.  

## License

Code - [GPLv3](https://github.com/shayc/cboard/blob/master/LICENSE)  
Symbols - [CC BY-SA](https://creativecommons.org/licenses/by-sa/2.0/uk/)
