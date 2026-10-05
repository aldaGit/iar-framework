const {mergeConfig, defineConfig} = require('jest');
const defaultConfig = require('./jest.config');

module.exports = mergeConfig(
    defaultConfig,
    defineConfig({
        collectCoverage: true,
        coverageDirectory: './coverage',
        coverageProvider: 'v8',
        coverageReporters: [
            'text',
            'text-summary',
            'cobertura'
        ]
    })
);
