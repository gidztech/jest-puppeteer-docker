const getConfig = require('./lib/config');

const baseConfig = getConfig();
const customConfig = Object.assign({}, baseConfig);

customConfig.connect.defaultViewport = {
    width: 500,
    height: 500
};

customConfig.chromiumFlags = ['–ignore-certificate-errors'];

module.exports = customConfig;
