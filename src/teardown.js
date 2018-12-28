const path = require('path');
const fs = require('fs');
const { teardown: teardownPuppeteer } = require('jest-environment-puppeteer');
const { dockerShutdownChromium } = require('docker-chromium');

module.exports = async function globalTeardown() {
    await teardownPuppeteer();

    // shut down Docker container
    await dockerShutdownChromium();

    // delete websocket from file for next time we run test suites
    const endpointPath = path.join(__dirname, '../', 'wsEndpoint');
    fs.writeFileSync(endpointPath, '');
};
