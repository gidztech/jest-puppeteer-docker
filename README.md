# jest-puppeteer-docker

![Tests](https://github.com/gidztech/jest-puppeteer-docker/workflows/Tests/badge.svg)
**Jest preset plugin that allows you to run your tests against a Chromium instance running in Docker**

[![NPM](https://nodei.co/npm/jest-puppeteer-docker.png)](https://www.npmjs.com/package/jest-puppeteer-docker)

## Installation

**Requirements:**

-   [`Docker`](https://docs.docker.com/install/)
-   [`Puppeteer`](https://github.com/GoogleChrome/puppeteer)
-   [`Jest`](https://jestjs.io/)

**Optional:**

-   [`jest-image-snapshot`](https://github.com/americanexpress/jest-image-snapshot)

This plugin uses [`jest-puppeteer`](https://github.com/smooth-code/jest-puppeteer), an awesome plugin created by the developers at [Smooth Code](https://www.smooth-code.com/), for using Puppeteer in your tests. If you are not doing Visual Regression Testing, you may want to use that plugin directly instead.

```
npm install --save-dev jest-puppeteer-docker puppeteer jest
```

**Note:** You should set an environment variable `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` to `true` to avoid unnecessarily downloading a local copy of Chromium, since we will be using a container.

## Basic Usage

**jest.config.js**

```js
module.exports = {
    preset: 'jest-puppeteer-docker'
};
```

Use Puppeteer in your tests:

```js
describe('Google', () => {
    beforeAll(async () => {
        await page.goto('https://google.com');
    });

    it('should display "google" text on page', async () => {
        await expect(page).toMatch('google');
    });
});
```

## Jest Puppeteer Config

By default, Jest Puppeteer is configured by this library to connect to Chromium in the Docker container instead of launching it on the host machine. You may wish to add additional configuration, as per the [puppeteer.connect](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerconnectoptions) options. You can add a `jest-puppeteer.config.js` in your package root, or reference a custom location by setting `process.env.JEST_PUPPETEER_CONFIG`.

Additionally, you can pass in [Chromium flags](https://peter.sh/experiments/chromium-command-line-switches/) to modify your launch criteria by providing a `chromiumFlags` array as well as other [Docker Chromium arguments](https://github.com/gidztech/docker-chromium/blob/master/README.md#api).

**jest-puppeteer.config.js**

```js
const getConfig = require('jest-puppeteer-docker/lib/config');

const baseConfig = getConfig();
const customConfig = Object.assign({}, baseConfig);

customConfig.connect.defaultViewport = {
    width: 500,
    height: 500
};

customConfig.chromiumFlags = ['–ignore-certificate-errors'];

module.exports = customConfig;
```

## How it works

`jest-puppeteer-docker` will pull down a Docker image with Chromium installed with the version matching the one associated with the Puppeteer dependency in your project.

When you run your tests, the container is started and `jest-puppeteer-docker` will connect to the Chromium instance within the container via the [Chrome Debugging Protocol](https://chromedevtools.github.io/devtools-protocol/). Your browser navigation and interactions will be performed in the container, while the test themselves are executed in your host environment.

Once the tests finish running, the Docker container will automatically be shutdown.

## Accessing Host

If you are running a web server on your host environment, you should be able to access it from the browser in the container at `host.docker.internal`.

For example, if you have a server running at `http://localhost:3000`, you can do the following in your test:

```js
await page.goto('http://host.docker.internal:3000/my-page');
```

If for any reason this doesn't work for you, check the [Troubleshooting](https://github.com/gidztech/jest-puppeteer-docker/blob/master/README.md#troubleshooting) section, or [create an issue](https://github.com/gidztech/jest-puppeteer-docker/issues/new).

## Visual Regression Testing

📃 [**Blog post:** Visual Regression Testing](https://medium.com/huddle-engineering/visual-regression-testing-ff7a1d31a112)

The main benefit of using Docker here is to support [Visual Regression Testing](https://medium.com/huddle-engineering/visual-regression-testing-ff7a1d31a112). Without Docker, different environments may yield unexpected results with image comparisons, due to anti-aliasing techniques. By providing a containerized environment, we can guarantee that the images produced are always the same.

### Example Test

[`jest-image-snapshot`](https://github.com/americanexpress/jest-image-snapshot) is a plugin that you can install, which will compare a screenshot with a baseline image that was previously generated when the test executed for the first time.

```js
it('should position the title and body correctly', async () => {
    const element = await global.page.$('.my-element');
    const image = await element.screenshot();
    expect(image).toMatchImageSnapshot();
});
```

### Example Config

Before tests execute, we can configure `jest-image-snapshot` globally with a threshold value, among other options, using the [`setupFilesAfterEnv`](https://jestjs.io/docs/en/configuration#setupfilesafterenv-array) hook provided by Jest.

**jest.config.js**

```js
module.exports = {
    preset: 'jest-puppeteer-docker',
    setupFilesAfterEnv: ['./test-environment-setup.js']
};
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

![Example Result](https://i.imgur.com/jtfBs7g.png)

## Advanced Config

As per standard Jest configuration, we can provide a [`globalSetup`](https://jestjs.io/docs/en/configuration.html#globalsetup-string) and [`globalTeardown`](https://jestjs.io/docs/en/configuration.html#globalteardown-string) hook for doing tasks that need to happen before the test suite initializes (e.g. starting a server), and after it finishes (e.g. closing a server).

```js
module.exports = {
    preset: 'jest-puppeteer-docker',
    globalSetup: './setup.js',
    globalTeardown: './teardown.js',
    setupFilesAfterEnv: ['./test-environment-setup.js']
};
```

**setup.js**

```js
const { setup: setupPuppeteer } = require('jest-puppeteer-docker');

module.exports = async jestConfig => {
    // any stuff you need to do can go here
    await setupPuppeteer(jestConfig);
};
```

**teardown.js**

```js
const { teardown: teardownPuppeteer } = require('jest-puppeteer-docker');

module.exports = async jestConfig => {
    await teardownPuppeteer(jestConfig);
    // any stuff you need to do can go here
};
```

Check out the [example in this repository](https://github.com/gidztech/jest-puppeteer-docker/tree/master/example) for an end-to-end example with reporting.

## Troubleshooting

### CircleCI

When configuring CircleCI, we need to enable the remote Docker engine to be able to run Docker Compose commands for building the Chrome container. This is achieved by adding the `setup_remote_docker` build step.

However, the job that runs in the base container is on a separate environment from the remote Docker engine (for security reasons). This means the remote container cannot access network resources from the base container, and is a problem for us. You can read more about [Running Docker commands](https://circleci.com/docs/2.0/building-docker-images/#separation-of-environments).

In order to get around this, we can use `machine` executor instead of the Docker one. This comes with Docker Compose installed, allowing us to interact with the container over the same network.

Checkout the example [CircleCI config](https://github.com/gidztech/jest-puppeteer-docker/tree/master/example/ci/.circleci/config.yml). It's worth noting that we need to set the NVM environment variable for every task because it gets reset, which is rather annoying.

If you have a better solution than this, please let me know as I don't know CircleCI very well.
