const {defineConfig} = require('jest');

module.exports = defineConfig({
    roots: [
        './test/integration'
    ],
    reporters: [
        'default',
        ['jest-junit', {outputDirectory: './results', outputName: 'integration-test-junit.xml'}]
    ]
});
