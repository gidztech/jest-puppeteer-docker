# jest-puppeteer-docker
**Jest plugin that allows you to run your Jest tests against a Chrome instance running in Docker.**

[Muppeteer](https://github.com/HuddleEng/Muppeteer) allows you to run your Mocha tests against a Chrome instance running in Docker with little Docker config and setup/teardown code. It's used to support cross-environmental Visual Regression Testing. I want to provide the same capability to Jest, but using a plugin based architecture.

## Status
I have succesfully managed to use [jest](https://github.com/facebook/jest), [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer), [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot) and the [Docker module from Muppeteer](https://github.com/HuddleEng/Muppeteer/blob/master/src/utils/dockerChrome.js) to run my Jest tests against an instance of Chrome running in a Docker container. 

This was achieved using a forked version of `jest-puppeteer` to support using an exsting Chrome instance, by providing it a web socket URI. I will be making a PR to the project shortly as it's useful in itself.

That is the first step, but it requires a lot of config and utils in my project.

## Plan
This plugin will wrap this all up. It will work with `jest-puppeteer` by doing the following things:
1. Provide configuration to pin the version of Chrome you want (like Muppeteer)
2. Build and launch Docker container with Chrome running on it (like Muppeteer)
3. Pass the Chrome web socket URI to `jest-puppeteer` (once PR merged)
4. Shutdown Docker container after test suite has completed

You can then use an image comparison plugin like `jest-image-snapshot` to do Visual Regression Testing.
