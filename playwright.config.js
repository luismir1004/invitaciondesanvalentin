import { defineConfig } from '@playwright/test';

// CHROMIUM_PATH permite usar un Chromium del sistema (sandbox/CI propio);
// si no está definido, Playwright usa su navegador descargado.
const executablePath = process.env.CHROMIUM_PATH || undefined;

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
        baseURL: 'http://127.0.0.1:4173',
        viewport: { width: 390, height: 844 },
        launchOptions: executablePath ? { executablePath } : {}
    },
    webServer: {
        command: 'npm run build && npm run preview -- --port 4173 --host 127.0.0.1',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 60_000
    }
});
