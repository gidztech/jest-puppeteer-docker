const path = require('path');
const fs = require('fs');

async function getConfig() {
    // use the existing Chromium websocket for tests
    const endpointPath = path.join(__dirname, 'wsEndpoint');
    const wsEndpoint = fs.readFileSync(endpointPath, 'utf8');

    return {
        // TODO: Allow user to pass in ignoreHTTPSErrors and slowMo (though latter might not be useful in a container)
        connect: {
            browserWSEndpoint: wsEndpoint
        }
    };
}

module.exports = getConfig;
