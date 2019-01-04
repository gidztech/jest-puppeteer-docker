module.exports = require('jest-environment-puppeteer');
module.exports.setup = require('../src/setup');
module.exports.teardown = require('../src/teardown');
module.exports.getConfig = require('../src/config');
