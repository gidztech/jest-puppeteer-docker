const path = require('path');

process.env.JEST_PUPPETEER_CONFIG = path.resolve(
    './node_modules/jest-puppeteer-docker/jest-puppeteer.config.js'
);

module.exports = require('jest-environment-puppeteer');
module.exports.setup = require('../src/setup');
module.exports.teardown = require('../src/teardown');
