const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports = {
    runCommand: async (command, args) => {
        const { stdout, stderr } = await exec(`${command} ${args.join(' ')}`);

        console.log(stdout);
        console.log(stderr);

        return stdout;
    },
    CONSOLE_PREFIX: 'Jest Puppeteer Docker:'
};
