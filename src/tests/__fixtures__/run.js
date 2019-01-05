#!/usr/bin/env node

const mock = require('mock-require');
mock('find-node-modules', () => ['./src/tests/__fixtures__']);

const setup = require('../../setup');

(async () => {
    try {
        await setup();
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
})();
