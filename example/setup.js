const express = require('express');
const { setup: setupPuppeteer } = require('../lib/index');
const path = require('path');

module.exports = async () => {
    const app = express();
    const directory = 'dist';
    app.use(express.static(path.join(__dirname, directory)));

    app.get('/', (req, res) => {
        res.sendFile('index.html');
    });

    global.__SERVER__ = app.listen(3000);

    await setupPuppeteer();
};
