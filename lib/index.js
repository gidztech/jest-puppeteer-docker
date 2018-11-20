const path = require('path');
const fs = require('fs');
const findNodeModules = require('find-node-modules');
const nodeModulePaths = findNodeModules({ relative: false });

const getConfigPath = p => {
    return path.join(p, 'jest-puppeteer-docker', 'jest-puppeteer.config.js');
};

const jestPuppeteerConfigPath = getConfigPath(
    nodeModulePaths.find(p => {
        const pathToTest = getConfigPath(p);
        return fs.existsSync(pathToTest);
    })
);

process.env.JEST_PUPPETEER_CONFIG = path.resolve(jestPuppeteerConfigPath);

module.exports = require('jest-environment-puppeteer').default;
module.exports.setup = require('../src/setup');
module.exports.teardown = require('../src/teardown');
