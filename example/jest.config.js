// This is the jest.config.js file used by the example test

module.exports = {
    preset: '<rootDir>../',
    setupFilesAfterEnv: ['./test-environment-setup.js'],
    globalSetup: './setup.js',
    globalTeardown: './teardown.js',
    reporters: [
        'default',
        [
            '../node_modules/jest-html-reporter',
            {
                outputPath: './example/report/summary.html',
                pageTitle: 'Component test results',
                includeFailureMsg: true,
                customScriptPath: './inject-fail-images.js'
            }
        ]
    ]
};
