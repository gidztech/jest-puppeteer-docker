const path = require('path');
const initExtensions = require('puppeteer-extensions');
const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

jest.setTimeout(10000);

const testFileName = global.jasmine.testPath;
const testPath = path.dirname(testFileName);

const toMatchImageSnapshot = configureToMatchImageSnapshot({
    failureThreshold: '0.01',
    failureThresholdType: 'percent'
});

expect.extend({ toMatchImageSnapshot });

global.visualCheck = async selector => {
    const element = await global.page.$(selector);
    const image = await element.screenshot();
    expect(image).toMatchImageSnapshot({
        customSnapshotsDir: path.join(testPath, 'screenshots')
    });
};

global.extensions = initExtensions(global.page);

global.runSetup = async () => {
    await global.page.goto('http://host.docker.internal:3000/');
    await global.extensions.turnOffAnimations();
};
