const path = require('path');

module.exports = {
    globalSetup: path.join(__dirname, 'src', 'setup.js'),
    globalTeardown: path.join(__dirname, 'src', 'teardown.js'),
    testEnvironment: 'jest-environment-puppeteer',
    setupFilesAfterEnv: ['expect-puppeteer']
};
