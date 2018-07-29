const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const path = require('path');
const fs = require('fs');
const { dockerRunChrome } = require('./docker-chrome');

module.exports = async () => {
    // line break
    console.log('\n');

    // launch Chrome in Docker ready for the first test suite
    const endpointPath = path.join(__dirname, 'wsEndpoint');
    const webSocketUri = await dockerRunChrome();
    fs.writeFileSync(endpointPath, webSocketUri);

    await setupPuppeteer();
};
