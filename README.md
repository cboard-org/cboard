[![Digital public good](https://github.com/cboard-org/cboard/blob/master/public/images/dpg-badge.png)](https://digitalpublicgoods.net/registry/)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/cboard/localized.svg)](https://crowdin.com/project/cboard)
[![Backers on Open Collective](https://opencollective.com/cboard/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/cboard/sponsors/badge.svg)](#sponsors)
[![cboard-org](https://circleci.com/gh/cboard-org/cboard.svg?style=shield)](https://app.circleci.com/pipelines/github/cboard-org/cboard)
# Cboard - AAC Communication Board for browsers

[Cboard](https://app.cboard.io) is an augmentative and alternative communication (AAC) web application, allowing users with speech and language impairments (autism, cerebral palsy) to communicate with symbols and text-to-speech.

![Cboard GIF demo](public/videos/demo.gif)

The app uses the browser's Speech Synthesis API to generate speech when a symbol is clicked. There are thousands of symbols from the most popular AAC symbol libraries to choose from when creating a board. Cboard is available in 40 languages (support varies by platform - Android, iOS, Windows).

**We're using Discord to collaborate, join us at: https://discord.gg/TEH8uxh**

## How does it work?

This video shows Srna. She is one of the children who have received the Cboard Communicator thanks to UNICEF’s ["For every child, a voice"](https://www.unicef.org/innovation/stories/giving-every-child-voice-aac-technology) project.

<a href="https://youtu.be/wqLauXnyLhY"><img src="https://img.youtube.com/vi/wqLauXnyLhY/0.jpg" alt="Real Look Autism Episode 8" width="480" height="360"></a>

## Translations

The app supports 40 languages.
Languages were machine translated and require proofreading: if you want to help proofread, please use our translation management platform: https://crowdin.com/project/cboard

**You do not need to be a programmer!**

Translations play a major role in this project and they contribute a lot for the inclusion of children, specially in non developed countries. Please consider collaborating with us!

### Translations for developers

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

### `npm run build-cordova-debug`

Use this to produce non-minified build for use in debugging within Cordova. It uses `react-app-rewired` & `config-overrides.js` to  customize webpack operation without ejecting react.

See [CBoard](https://github.com/nous-/cboard) repo for packaging this CBoard application within Cordova.

## Docker getting started

### `make image`

Creates a Docker image with cboard built for production. The image is tagged as cboard:latest.

### `make run`

Runs the cboard:latest Docker image on port 5000.

## Secrets Management

Some external services have APIs we need to access, and these require API keys. To prevent open disclosure of these keys in the public repository, while still tracking them with the code, we encrypt some secrets into a GPG file. These files are `env/local-private.gpg` and `env/prod-private.gpg`.

In order to access the secrets, you must request the `ENCRYPTION_KEY` from @shaycojo and then run the decrypt script: `ENCRYPTION_KEY={key-goes-here} yarn decrypt:local` (or `prod`), which will create the file `.private/local.js` with the secrets in plain text where the scripts can access them. **The files in `.private` should never be committed to the repository.**

If you need to add or change a secret, make the change to the `.private/local.js` file, and then run the encryption script: `ENCRYPTION_KEY={key-goes-here} yarn encrypt:local` (or `prod`).

_Note: These keys/secrets are *not* required to run or develop Cboard._ They are used with scripts by some team members.

## About the Cboard community

[![Cauldron dashboard and metrics for the Cboard project community](https://cauldron.io/project/1683/stats.svg)](https://cauldron.io/project/1683 "Cauldron dashboard and metrics for the Cboard project community")

## Thanks

### Symbols sources

<img src="https://mulberrysymbols.org/assets/examples/hello.svg" href="https://mulberrysymbols.org" alt="Mulberry" width="40" height="40"> [Mulberry](https://mulberrysymbols.org/)

<img src="https://static.arasaac.org/images/arasaac-logo.svg" href="https://mulberrysymbols.org" alt="ARASAAC" width="40" height="40"> [ARASAAC](http://www.arasaac.org/)

<img src="https://globalsymbols.com/assets/logo-with-text-5c57659e34824e7b2907a36895745f9e39e7f1c015ea77d6968eb75a52c8389f.svg" href="https://globalsymbols.com" alt="Global Symbols" width="40" height="40"> [Global Symbols](https://globalsymbols.com/)

### Translation

<img src="https://support.crowdin.com/assets/logos/crowdin-symbol.png" href="https://crowdin.com/" alt="Crowdin" width="40" height="40">[  Crowdin](https://crowdin.com/) - for providing the localization management platform.

### Testing platform

<img src="https://avatars2.githubusercontent.com/u/1119453?s=200&v=4" href="https://www.browserstack.com/" alt="Browserstack" width="40" height="40">[  Browserstack](https://www.browserstack.com/) - for providing the automation infrastructure for testing.

### Development

<img src="./public/images/sponsers/css-tricks.svg" alt="CSS-Tricks" width="120" height="39">[  CSS Tricks](https://css-tricks.com) - for providing feedback and support from the early stage.

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/cboard-org/cboard/graphs/contributors"><img src="https://opencollective.com/cboard/contributors.svg?width=890&button=false" /></a>

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


## :memo: Legal & licenses

Copyright © 2017-2021, [OTTAA Project](https://ottaa-project.github.io/) & Cboard contributors.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3 as published by the Free Software Foundation.

* Code - [GPLv3](https://github.com/cboard-org/cboard/blob/master/LICENSE.txt)
* Mulberry Symbols - [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
* ARASAAC Symbols - [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
