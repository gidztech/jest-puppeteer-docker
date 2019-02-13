const path = require('path');
const fs = require('fs');

module.exports = () => {
    // use the existing Chromium WebSocket for tests
    const endpointPath = path.join(__dirname, '../', 'wsEndpoint');
    let wsEndpoint = '';

    if (!fs.existsSync(endpointPath)) {
        fs.writeFileSync(endpointPath, '', { encoding: 'utf8' });
    } else {
        wsEndpoint = fs.readFileSync(endpointPath, 'utf8');
    }

    return {
        connect: {
            browserWSEndpoint: wsEndpoint
        }
    };
};
