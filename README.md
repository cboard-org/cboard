[![Crowdin](https://d322cqt584bo4o.cloudfront.net/cboard/localized.svg)](https://crowdin.com/project/cboard)
[![Backers on Open Collective](https://opencollective.com/cboard/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/cboard/sponsors/badge.svg)](#sponsors)

# Cboard - AAC Communication Board for the Browser

[Cboard](https://app.cboard.io) is an augmentative and alternative communication (AAC) web application, allowing users with speech and language impairments (autism, cerebral palsy) to communicate by symbols and text-to-speech.

<img src='https://i.imgur.com/eeH9cUM.jpg' width='794' alt='Cboard screenshot'>

The app uses the browser's Speech Synthesis API to generate speech when a symbol is clicked, there are 3400 symbols to choose from when creating a board. Cboard is available in 33 languages (support varies by platform - Android, iOS, Windows).

**We're using Discord to collaborate, join us at: https://discord.gg/TEH8uxh**

## How does it work?

This video from Real Look Autism will help you understand how communication boards are being used.

**Disclaimer:** the app in the video is not Cboard.

<a href="https://www.youtube.com/watch?v=oIGrxzPMVtw"><img src="https://img.youtube.com/vi/oIGrxzPMVtw/0.jpg" alt="Real Look Autism Episode 8" width="480" height="360"></a>

## Translations

The app supports 33 languages.
Languages were machine translated and require proofreading, if you want to help proofread click here: https://cboard-org.github.io/cboard-translate/ - you do not need to be a programmer!

In order to pull the latest translations from CrowdIn into the codebase, you can run `yarn translations:pull`. This will update all language files such as `en.json` as well as the central `cboard.json` file. Please note that this requires the CrowdIn API key to be available in the `.private` config file. Refer to [Secrets Management](#secrets-management). After the script completes, changes to the translation files will need to be committed to the repo by the usual process.

## Getting Started

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

### `make image`

Creates a Docker image with cboard built for production. The image is tagged as cboard:latest.

### `make run`

Runs the cboard:latest Docker image on port 5000.

## Secrets Management

Some external services have APIs we want to access, and these require API keys. To prevent open disclosure of these keys in the public repository, while still tracking them with the code, we encrypt some secrets into a GPG file. These files are `env/local-private.gpg` and `env/prod-private.gpg`.

In order to access the secrets, you must request the `ENCRYPTION_KEY` from @shaycojo and then run the decrypt script: `ENCRYPTION_KEY={key-goes-here} yarn decrypt:local` (or `prod`), which will create the file `.private/local.js` with the secrets in plain text where the scripts can access them. **The files in `.private` should never be committed to the repository.**

If you need to add or change a secret, make the change to the `.private/local.js` file, and then run the encryption script: `ENCRYPTION_KEY={key-goes-here} yarn encrypt:local` (or `prod`).

_Note: These keys/secrets are *not* required to run or develop Cboard._ They are used with scripts by some team members.

## Thanks

[Straight Street](http://straight-street.com/gallery.php) - for providing the symbols.
[Crowdin](https://crowdin.com/) - for providing the localization management platform.
[<img src="https://www.browserstack.com/images/mail/browserstack-logo-footer.png" width="120" alt="Live, web-based browser testing">](https://www.browserstack.com/)
Thank you to BrowserStack for providing the infrastructure to test Cboard in real browsers.

[<img src="https://cdn.auth0.com/oss/badges/a0-badge-light.png" width="150" height="50" alt="JWT Auth for open source projects">](https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss)
Thank you to Auth0 for providing the token based authentication.

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="graphs/contributors"><img src="https://opencollective.com/cboard/contributors.svg?width=890&button=false" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/cboard#backer)]

<a href="https://opencollective.com/cboard#backers" target="_blank"><img src="https://opencollective.com/cboard/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/cboard#sponsor)]

<a href="https://opencollective.com/cboard/sponsor/0/website" target="_blank"><img src="https://opencollective.com/cboard/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/cboard/sponsor/1/website" target="_blank"><img src="https://opencollective.com/cboard/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/cboard/sponsor/2/website" target="_blank"><img src="https://opencollective.com/cboard/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/cboard/sponsor/3/website" target="_blank"><img src="https://opencollective.com/cboard/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/cboard/sponsor/4/website" target="_blank"><img src="https://opencollective.com/cboard/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/cboard/sponsor/5/website" target="_blank"><img src="https://opencollective.com/cboard/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/cboard/sponsor/6/website" target="_blank"><img src="https://opencollective.com/cboard/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/cboard/sponsor/7/website" target="_blank"><img src="https://opencollective.com/cboard/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/cboard/sponsor/8/website" target="_blank"><img src="https://opencollective.com/cboard/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/cboard/sponsor/9/website" target="_blank"><img src="https://opencollective.com/cboard/sponsor/9/avatar.svg"></a>

## License

Code - [GPLv3](https://github.com/shayc/cboard/blob/master/LICENSE)
Symbols - [CC BY-SA](https://creativecommons.org/licenses/by-sa/2.0/uk/)
