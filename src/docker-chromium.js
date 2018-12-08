const path = require('path');
const request = require('request-promise-native');
const syncRequest = require('sync-request');
const { readFileSync, writeFileSync } = require('fs');
const { CONSOLE_PREFIX, runCommand } = require('./utils');

require('colors');

const composePath = path.join(__dirname, '../docker-compose.yml');

const dockerBuild = async () => {
    try {
        console.log(`${CONSOLE_PREFIX} Building Docker image...`.green);
        await runCommand('docker-compose', [
            '-f',
            `"${composePath}"`,
            'build',
            `--build-arg CHROMIUM_ADDITIONAL_ARGS="${process.env
                .CHROMIUM_ADDITIONAL_ARGS || '[]'}"`,
            '--pull',
            'chromium'
        ]);
        console.log(`${CONSOLE_PREFIX} Successfully built Docker image`.green);
    } catch (exitCode) {
        console.error(
            `${CONSOLE_PREFIX} (Exit code ${exitCode}) Failed to build Docker image`
                .red
        );
    }
};

const dockerUp = async () => {
    try {
        console.log(`${CONSOLE_PREFIX} Starting Docker container...`.green);
        await runCommand('docker-compose', [
            '-f',
            `"${composePath}"`,
            'up',
            '-d'
        ]);
        console.log(
            `${CONSOLE_PREFIX} Successfully started Docker container`.green
        );
    } catch (exitCode) {
        console.error(
            `${CONSOLE_PREFIX} (Exit code ${exitCode}) Failed to start Docker container`
                .red
        );
    }
};

const dockerDown = async () => {
    try {
        console.log(
            `${CONSOLE_PREFIX} Shutting down Docker container...`.green
        );
        await runCommand('docker-compose', ['-f', `"${composePath}"`, 'down']);
        console.log(
            `${CONSOLE_PREFIX} Successfully shutdown Docker container`.green
        );
    } catch (exitCode) {
        console.error(
            `${CONSOLE_PREFIX} (Exit code ${exitCode}) Failed to shut down Docker container`
                .red
        );
    }
};

const contactChromium = async ({ config, maxAttempts }) => {
    let count = 1;
    console.log(`${CONSOLE_PREFIX} Contacting Chromium in container...`.green);

    async function tryRequest() {
        try {
            return await request(config);
        } catch (e) {
            count += 1;
            if (count <= maxAttempts) {
                return new Promise(resolve => {
                    setTimeout(async () => {
                        console.log(
                            `${CONSOLE_PREFIX} Attempt #${count}`.yellow
                        );
                        resolve(await tryRequest());
                    }, 500);
                });
            }
            console.log(
                `${CONSOLE_PREFIX} Max number of attempts exceeded. I'm giving up!`
                    .red
            );
            throw e;
        }
    }

    return tryRequest();
};

const dockerUpdateChromium = revision => {
    const dockerFilePath = path.join(__dirname, '../Dockerfile');

    let latestTag = '';

    if (revision) {
        latestTag = `rev-${revision}`;
    } else {
        const res = syncRequest(
            'GET',
            'https://hub.docker.com/v2/repositories/alpeware/chrome-headless-trunk/tags/'
        );

        const body = JSON.parse(res.getBody('utf8'));

        if (body && body.results && body.results.length) {
            const { name } = body.results[0];

            // sometimes 'latest' tag appears before or after the actual tag so deal with either case
            if (name !== 'latest') {
                latestTag = name;
            } else {
                latestTag = body.results[1] && body.results[1].name;
            }
        }
    }

    const data = readFileSync(dockerFilePath, { encoding: 'utf-8' });
    const previousTag = data.match(/:(.*)/)[1]; // get everything after : on same line
    const newData = data.replace(previousTag, latestTag);
    writeFileSync(dockerFilePath, newData, { encoding: 'utf-8' });
};

const dockerRun = async () => {
    await dockerBuild();
    await dockerUp();

    const res = await contactChromium({
        config: {
            uri: `http://localhost:9222/json/version`,
            json: true,
            resolveWithFullResponse: true
        },
        maxAttempts: 5
    });

    const webSocketUri = res.body.webSocketDebuggerUrl;
    console.log(
        `${CONSOLE_PREFIX} Connected to WebSocket URL: ${webSocketUri}`.green
    );

    return webSocketUri;
};

module.exports = {
    dockerShutdownChromium: dockerDown,
    dockerRunChromium: dockerRun,
    dockerUpdateChromium
};
