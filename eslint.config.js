import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        files: ['src/**/*.js', 'tests/**/*.js', '*.config.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                requestAnimationFrame: 'readonly',
                requestIdleCallback: 'readonly',
                setInterval: 'readonly',
                setTimeout: 'readonly',
                clearInterval: 'readonly',
                IntersectionObserver: 'readonly',
                CustomEvent: 'readonly',
                Audio: 'readonly',
                AudioContext: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                TextEncoder: 'readonly',
                getComputedStyle: 'readonly',
                console: 'readonly',
                process: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': ['warn', { allow: ['warn', 'error'] }]
        }
    },
    {
        ignores: ['dist/', 'node_modules/', 'public/']
    }
];
