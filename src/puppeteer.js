const path = require('path');
const fs = require('fs');
const findNodeModules = require('find-node-modules');
const nodeModulePaths = findNodeModules({ relative: false });

const getFullPuppeteerPath = p => {
    return path.join(p, 'puppeteer');
};

const nodeModulePathWithPuppeteerConfig = nodeModulePaths.find(p => {
    const pathToTest = getFullPuppeteerPath(p);
    return fs.existsSync(pathToTest);
});

const puppeteerConfigPath = getFullPuppeteerPath(
    nodeModulePathWithPuppeteerConfig
);

module.exports = {
    getChromiumRevision: () => {
        let revision =
            process.env.PUPPETEER_CHROMIUM_REVISION ||
            process.env.npm_config_puppeteer_chromium_revision;

        if (!revision) {
            const revisionsFilePath = path.resolve(
                path.join(puppeteerConfigPath, 'lib/cjs/puppeteer/revisions.js')
            );
            if (fs.existsSync(revisionsFilePath)) {
                const revisionsFile = require(revisionsFilePath);

                if (
                    revisionsFile.PUPPETEER_REVISIONS &&
                    revisionsFile.PUPPETEER_REVISIONS.chromium
                ) {
                    revision = revisionsFile.PUPPETEER_REVISIONS.chromium;
                } else {
                    throw new Error(
                        'Chromium revision is missing in revisions file of Puppeteer dependency'
                    );
                }
            } else {
                // for older versions of Puppeteer
                const packageFile = require(path.resolve(
                    path.join(puppeteerConfigPath, 'package.json')
                ));

                if (
                    packageFile &&
                    packageFile.puppeteer &&
                    packageFile.puppeteer.chromium_revision
                ) {
                    revision = packageFile.puppeteer.chromium_revision;
                } else {
                    throw new Error(
                        'Unable to find Chromium revision from Puppeteer. Ensure that you have Puppeteer installed.'
                    );
                }
            }
        }

        return revision;
    }
};
