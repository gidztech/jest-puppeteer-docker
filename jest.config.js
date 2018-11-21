// This is the jest.config.js file used by the example test

module.exports = {
    preset: '<rootDir>',
    setupTestFrameworkScriptFile: './example/test-environment-setup.js',
    globalSetup: './example/setup.js',
    globalTeardown: './example/teardown.js',
    reporters: [
        'default',
        [
            './node_modules/jest-html-reporter',
            {
                outputPath: './example/report/summary.html',
                pageTitle: 'Component test results',
                includeFailureMsg: true,
                customScriptPath: './example/inject-fail-images.js'
            }
        ]
    ]
};
