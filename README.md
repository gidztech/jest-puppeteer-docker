# jest-puppeteer-docker

[![Build Status](https://travis-ci.org/gidztech/jest-puppeteer-docker.svg?branch=master)](https://travis-ci.org/gidztech/jest-puppeteer-docker)
**Jest preset plugin that allows you to run your Jest tests against a Chrome instance running in Docker**

## Prerequisites
You will need to make sure Docker is installed on the environments you are running on. \
See https://docs.docker.com/install/ for instructions for installing on various platforms.

[`puppeteer`](https://www.google.com/search?q=puppeteer&ie=utf-8&oe=utf-8&client=firefox-b-ab) and [`jest`](https://jestjs.io/) are also required.

```
npm install --save-dev jest-puppeteer-docker puppeteer jest
```

## Basic Usage

**jest.config.js**

```js
module.exports = {
    preset: 'jest-puppeteer-docker'
}
```

Use Puppeteer in your tests:

```js
describe('Google', () => {
    beforeAll(async () => {
        await page.goto('https://google.com')
    });

    it('should display "google" text on page', async () => {
        await expect(page).toMatch('google')
    });
})
```

## How it works
When you run your tests, `jest-puppeteer-docker` will look at the version number of Chromium associated with the Puppeteer dependency in your project, and bring up a Docker container with that version of Chromium installed on it. The tests will run in your host environment, but will interact with Chromium running within the container via the [Chrome Debugging Protocol](https://chromedevtools.github.io/devtools-protocol/).

Once the tests finish running, the Docker container will automatically be shutdown.

## Visual Regression Testing
The main benefit of using Docker here is to support [Visual Regression Testing](https://medium.com/huddle-engineering/visual-regression-testing-ff7a1d31a112). Without Docker, different environments may yield unexpected results with image comparisons due to anti-aliasing techniques. By providing a containerized environment, we can guarantee that the images produced are always the same.

### Example Test
[`jest-image-snapshot`](https://github.com/americanexpress/jest-image-snapshot) is a plugin that you can install, which will compare a screenshot with a baseline image that was previously generated when the test executed for the first time.

```js
it('title and body appear correctly', async () => {
    const element = await global.page.$('.my-element');
    const image = await element.screenshot();
    expect(image).toMatchImageSnapshot();
});
```

### Example Config
Before tests execute, we can configure `jest-image-snapshot` globally with a threshold value, among other options, using the [`setupTestFrameworkScriptFile`](https://jestjs.io/docs/en/configuration.html#setuptestframeworkscriptfile-string) hook provided by Jest.

**jest.config.js**
```js
module.exports = {
    preset: 'jest-puppeteer-docker',
    setupTestFrameworkScriptFile: './test-environment-setup.js'
}
```

**test-environment.setup.js**
```js
const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

const toMatchImageSnapshot = configureToMatchImageSnapshot({
    failureThreshold: '0.01',
    failureThresholdType: 'percent'
});

expect.extend({ toMatchImageSnapshot });
```

### Example Result
![Example Result](https://i.imgur.com/4ltspCN.png)

## Advanced Config
As per standard Jest configuration, we can provide a [`globalSetup`](https://jestjs.io/docs/en/configuration.html#globalsetup-string) and [`globalTeardown`](https://jestjs.io/docs/en/configuration.html#globalteardown-string) hook for doing tasks that need to happen before the test suite initializes (e.g. starting a server), and after it finishes (e.g. closing a server).

```js
module.exports = {
    preset: 'jest-puppeteer-docker',
    globalSetup: './setup.js',
    globalTeardown: './teardown.js',
    setupTestFrameworkScriptFile: './test-environment-setup.js'
}
```

**setup.js**
```js
const { setup: setupPuppeteer } = require('jest-puppeteer-docker');

module.exports = async () => {
    // any stuff you need to do can go here
    await setupPuppeteer();
};
```

**teardown.js**
```js
const { teardown: teardownPuppeteer } = require('jest-puppeteer-docker');

module.exports = async () => {
     await teardownPuppeteer();
     // any stuff you need to do can go here
};
```
Check out the [example in this repository](https://github.com/gidztech/jest-puppeteer-docker/tree/master/example) for an end-to-end example with reporting.
