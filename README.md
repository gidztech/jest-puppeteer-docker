# jest-puppeteer-docker
**Jest preset plugin that allows you to run your Jest tests against a Chrome instance running in Docker**

[![Build Status](https://travis-ci.org/gidztech/jest-puppeteer-docker.svg?branch=master)](https://travis-ci.org/gidztech/jest-puppeteer-docker)

```
npm install --save-dev jest-puppeteer-docker puppeteer jest
```


## Prerequisites
You will need to make sure Docker is installed on the environments you are running on. See https://docs.docker.com/install/ for instructions for installing on various platforms.

[`puppeteer`](https://www.google.com/search?q=puppeteer&ie=utf-8&oe=utf-8&client=firefox-b-ab) and [`jest`](https://jestjs.io/) are also required.

## Basic Usage

Update your Jest configuration:

```json
{
  "preset": "jest-puppeteer-docker"
}
```

Use Puppeteer in your tests:

```js
describe('Google', () => {
  beforeAll(async () => {
    await page.goto('https://google.com')
  })

  it('should display "google" text on page', async () => {
    await expect(page).toMatch('google')
  })
})
```
When you run your tests, `jest-puppeteer-docker` will look at the version of Chromium linked to your Puppeteer version and bring up a Docker container with that version installed. Your tests will run in your host environment, but will interact with Chrome within the container via the [Chrome Debugging Protocol](https://chromedevtools.github.io/devtools-protocol/).

Upon test completion, the Docker container will automatically be shutdown.

## [Visual Regression Testing](https://medium.com/huddle-engineering/visual-regression-testing-ff7a1d31a112)
The main benefit of using Docker here is to support Visual Regression Testing. Different environments may yield unexpected results with image comparisons due to anti-aliasing techniques. By providing a containerized environment, we can guarantee the environment is exactly the same everytime the tests are run.

TODO: Add more content
