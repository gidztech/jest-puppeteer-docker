const fs = require('fs');
const { teardown: teardownPuppeteer } = require('../lib/index');

module.exports = async function globalTeardown(jestConfig) {
    global.__SERVER__.close();
    await teardownPuppeteer(jestConfig);

    console.log(__dirname);
    fs.copyFileSync(
        `${__dirname}/inject-fail-images.js`,
        `${__dirname}/report/inject-fail-images.js`
    );
};
