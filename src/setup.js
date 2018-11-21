const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const path = require('path');
const fs = require('fs');
const findNodeModules = require('find-node-modules');
const nodeModulePaths = findNodeModules({ relative: false });
const {
    dockerUpdateChromium,
    dockerRunChromium
} = require('./docker-chromium');

require('colors');

const { CONSOLE_PREFIX } = require('./utils');

const getPackagePath = p => {
    return path.join(p, 'puppeteer', 'package.json');
};

const getFullConfigPath = p => {
    return path.join(p, 'jest-puppeteer-docker', 'jest-puppeteer.config.js');
};

const puppeteerConfigPath = getPackagePath(
    nodeModulePaths.find(p => {
        const pathToTest = getPackagePath(p);
        return fs.existsSync(pathToTest);
    })
);

const foundPath = nodeModulePaths.find(p => {
    const pathToTest = getFullConfigPath(p);
    return fs.existsSync(pathToTest);
});

if (foundPath) {
    process.env.JEST_PUPPETEER_CONFIG = getFullConfigPath(foundPath);
} else {
    // assume it's in the current repository
    process.env.JEST_PUPPETEER_CONFIG = 'jest-puppeteer.config.js';
}

module.exports = async () => {
    console.log('\n');

    const revision =
        process.env.PUPPETEER_CHROMIUM_REVISION ||
        process.env.npm_config_puppeteer_chromium_revision ||
        require(path.resolve(puppeteerConfigPath)).puppeteer.chromium_revision;

    // set the version of Chromium to use based on Puppeteer
    console.log(
        `${CONSOLE_PREFIX} Setting Chromium version to rev-${revision}...`.green
    );

    dockerUpdateChromium(revision);

    // launch Chromium in Docker ready for the first test suite
    const endpointPath = path.join(__dirname, '../', 'wsEndpoint');
    const webSocketUri = await dockerRunChromium();
    fs.writeFileSync(endpointPath, webSocketUri);

    await setupPuppeteer();
};
