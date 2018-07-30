const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports = {
    runCommand: async (command, args) => {
        try {
            const { stdout, stderr } = await exec(
                `${command} ${args.join(' ')}`
            );

            console.log(stdout);
            console.log(stderr);

            return stdout;
        } catch (e) {
            console.error(e);
            return e;
        }
    }
};
