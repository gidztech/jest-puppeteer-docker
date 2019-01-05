const path = require('path');
const { spawn } = require('child_process');

describe('setup', () => {
    it('should set Chromium version correctly', async () => {
        const success = await spawnAndWaitFor(
            'Setting Chromium version to rev-12345...'
        );
        expect(success).toBeTruthy();
    });

    it('should set Chromium flags correctly', async () => {
        const success = await spawnAndWaitFor(
            'Setting Chromium flags to –ignore-certificate-errors...'
        );
        expect(success).toBeTruthy();
    });
});

const spawnAndWaitFor = output => {
    return new Promise((resolve, reject) => {
        const env = Object.create(process.env);

        env.JEST_PUPPETEER_CONFIG = path.resolve(
            __dirname,
            '__fixtures__/jest-puppeteer.config.js'
        );

        const childProcess = spawn('node', ['src/tests/__fixtures__/run.js'], {
            env
        });

        childProcess.stdout.on('data', data => {
            const dataStr = data.toString().trim();

            if (dataStr.indexOf(output) !== -1) {
                resolve(1);
                childProcess.kill('SIGINT');
            }
        });

        childProcess.stderr.on('data', () => {
            reject(0);
        });
    });
};
