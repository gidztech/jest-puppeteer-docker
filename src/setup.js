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

const getFullPuppeteerConfigPath = p => {
    return path.join(p, 'puppeteer', 'package.json');
};

const nodeModulePathWithPuppeteerConfig = nodeModulePaths.find(p => {
    const pathToTest = getFullPuppeteerConfigPath(p);
    return fs.existsSync(pathToTest);
});

const puppeteerConfigPath = getFullPuppeteerConfigPath(
    nodeModulePathWithPuppeteerConfig
);

// if user hasn't specified a custom jest puppeteer config path,
// we will look for a config at their package root,
// otherwise use default internal one
if (!process.env.JEST_PUPPETEER_CONFIG) {
    const rootJestPuppeteerConfigPath = path.join(
        nodeModulePaths[0],
        '../',
        'jest-puppeteer.config.js'
    );

    if (fs.existsSync(rootJestPuppeteerConfigPath)) {
        process.env.JEST_PUPPETEER_CONFIG = rootJestPuppeteerConfigPath;
    } else {
        process.env.JEST_PUPPETEER_CONFIG = path.join(
            __dirname,
            '../',
            'jest-puppeteer.config.js'
        );
    }
}

const { chromiumArgs } = require(path.resolve(
    process.env.JEST_PUPPETEER_CONFIG
));

if (chromiumArgs) {
    process.env.CHROMIUM_ADDITIONAL_ARGS = chromiumArgs;
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
