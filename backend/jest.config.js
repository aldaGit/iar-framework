const {defineConfig} = require('jest');

module.exports = defineConfig({
    roots: [
        './test/unit'
    ],
    reporters: [
        'default',
        ['jest-junit', {outputDirectory: './results', outputName: 'unit-test-junit.xml'}]
    ]
});
