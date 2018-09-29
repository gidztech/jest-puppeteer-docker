const path = require('path');
const fs = require('fs');

// use the existing Chromium websocket for tests
const endpointPath = path.join(__dirname, 'wsEndpoint');
const wsEndpoint = fs.readFileSync(endpointPath, 'utf8');

module.exports = {
    connect: {
        browserWSEndpoint: wsEndpoint
    }
};
