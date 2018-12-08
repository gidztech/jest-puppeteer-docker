const path = require('path');
const fs = require('fs');

module.exports = () => {
    // use the existing Chromium websocket for tests
    const endpointPath = path.join(__dirname, '../', 'wsEndpoint');

    let config = {};

    if (fs.existsSync(endpointPath)) {
        const wsEndpoint = fs.readFileSync(endpointPath, 'utf8');
        config.connect = {
            browserWSEndpoint: wsEndpoint
        };
    }

    return config;
};
