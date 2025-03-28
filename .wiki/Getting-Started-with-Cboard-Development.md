
Interested in contributing to Cboard? Thanks! There are plenty of ways you can help.

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.
Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue or assessing patches and features. Follow this guide to get up and running.

## A few things to know

In order to contribute as a developer, you will need to have a basic understanding of [React](https://facebook.github.io/react/docs/hello-world.html) and probably [Redux](https://egghead.io/courses/getting-started-with-redux), you will also need to be familiar with [Material-UI](https://material-ui.com/).
 It is highly recommended that you read [Cboard Contributing guide](https://github.com/cboard-org/cboard/blob/master/CONTRIBUTING.md) so that you know code guidelines as well as what is required when you want to submit a change.

## Developer Chat
Our developer community is always helpful to new developers wanting to get their feet wet with Cboard programming. If you ever need help you can join the developer chat on Discord here: **[https://discord.gg/cboard](https://discord.gg/TEH8uxh)**

## Starting Cboard Development

### 1. Get the code
Check out the source code for Cboard from Github: [https://github.com/cboard-org/cboard](https://github.com/cboard-org/cboard)

Create your own fork of Cboard repository. You can use the 'fork button' that is in the top-right corner.

Clone it.
```
git clone --recursive https://github.com/%user%/cboard.git
```

Don't forget the `--recursive` argument to get all submodules.

### 2. Build the code
The next step is to get the program building so that you can start making your modifications.

Install packages using Npm or Yarn. With Npm move to Cboard directory and run

```
npm install
```
Start Cboard (by default) on [http://localhost:3000](http://localhost:3000) using:
```
npm start
```
### 3. Read the documentation
Cboard reference documentation can be found here: [[Cboard Architecture Reference]]

It's also recommended to examine some of the featured repositories to see how they interact with Cboard, specially the [API repository](https://github.com/cboard-org/cboard-api), and the [Mobile application repository](https://github.com/cboard-org/ccboard), so you can begin to see how the different modules of code fit together.

### 4. Check out issues on the Ideas page and the Bug Tracker

Many user post ideas and suggestions for improvements to Cboard on the discussions page. You can find the page here: [https://github.com/cboard-org/cboard/discussions/](https://github.com/cboard-org/cboard/discussions)

Cboard currently tracks bugs on [GitHub Issues](https://github.com/cboard-org/cboard/issues).

Feel free to explore ideas, issues, suggestions, and bugs, and if you feel so inclined, try your hand at implementing one!

## A quick note about licensing

Cboard is an open source program licensed under the [GPLv3](https://github.com/cboard-org/cboard/blob/master/LICENSE).

Thanks for being willing to help out, and good luck!