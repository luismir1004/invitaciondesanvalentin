// @ts-check
/* ============================================================
   E2E — La invitación completa, de telón a "Aceptar".
   Estas pruebas protegen los momentos que Ale va a vivir.
   ============================================================ */

import { test, expect } from '@playwright/test';

test.describe('Un Año Contigo', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('el intro se muestra y el hero espera oculto detrás del telón', async ({ page }) => {
        await expect(page.locator('#intro')).toBeVisible();
        await expect(page.locator('#intro-open')).toBeFocused();
        // El hero no revela su contenido hasta abrir
        const revealed = await page.locator('.hero [data-reveal].is-visible').count();
        expect(revealed).toBe(0);
    });

    test('abrir la invitación revela el hero y arranca la experiencia', async ({ page }) => {
        await page.click('#intro-open');
        await expect(page.locator('#intro')).toBeHidden({ timeout: 3000 });
        await expect(page.locator('.hero [data-reveal].is-visible')).toHaveCount(1);
    });

    test('el orden narrativo es el crescendo correcto', async ({ page }) => {
        const order = await page.locator('main section').evaluateAll(
            (els) => els.map((el) => el.className.split(' ')[0])
        );
        expect(order).toEqual([
            'hero', 'counter', 'history', 'reasons', 'photos',
            'message', 'music', 'event', 'cta'
        ]);
    });

    test('el contador corre y la cuenta regresiva a la cena aparece', async ({ page }) => {
        await page.click('#intro-open');
        const days = page.locator('#counter-days');
        await expect(days).not.toHaveText('0');
        await expect(page.locator('#event-countdown')).not.toBeEmpty();
    });

    test('los 4 videos tienen fuente local y los locales tienen poster', async ({ page }) => {
        const videos = await page.locator('video').evaluateAll((els) =>
            els.map((v) => ({
                src: v.getAttribute('src') || v.getAttribute('data-lazy-src') || '',
                poster: v.getAttribute('poster') || ''
            }))
        );
        expect(videos).toHaveLength(4);
        for (const v of videos) {
            expect(v.src).toContain('./assets/');
            expect(v.poster).toContain('./assets/');
        }
    });

    test('los anchos de columna del layout se mantienen', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.click('#intro-open');
        const w = async (sel) => {
            const el = page.locator(sel);
            const box = await el.boundingBox();
            return box ? Math.round(box.width) : null;
        };
        expect(await w('.counter-grid')).toBe(620);
        expect(await w('.timeline')).toBe(520);
        expect(await w('.masonry-grid')).toBe(720);
        expect(await w('.hero .video-bg')).toBe(1440);
    });

    test('aceptar la invitación celebra y transforma el botón', async ({ page }) => {
        await page.click('#intro-open');
        await page.waitForTimeout(1200);
        // Evitar que se abra WhatsApp real en el test
        await page.evaluate(() => { window.open = () => ({ closed: false }); });
        const btn = page.locator('#rsvp-button');
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        await expect(btn).toHaveText(/Aceptada/);
        await expect(btn).toBeDisabled();
        await expect(page.locator('#rsvp-confirmation')).toBeVisible();
        expect(await page.locator('.celebrate-heart').count()).toBeGreaterThan(0);
    });

    test('la galería tiene 12 fotos con caption y el lightbox abre', async ({ page }) => {
        await page.click('#intro-open');
        await expect(page.locator('.photo-caption')).toHaveCount(12);
        const firstPhoto = page.locator('.photo-card img').first();
        await firstPhoto.scrollIntoViewIfNeeded();
        await firstPhoto.click();
        await expect(page.locator('#lightbox')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('#lightbox')).toBeHidden();
    });

    test('sin errores de JavaScript en toda la página', async ({ page }) => {
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await page.click('#intro-open');
        await page.evaluate(async () => {
            for (let y = 0; y <= document.body.scrollHeight; y += 500) {
                window.scrollTo(0, y);
                await new Promise((r) => setTimeout(r, 60));
            }
        });
        await page.waitForTimeout(800);
        expect(errors).toEqual([]);
    });

    test('las 9 secciones tienen nombre accesible', async ({ page }) => {
        const unnamed = await page.locator('main section').evaluateAll((els) =>
            els.filter((el) =>
                !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')
            ).length
        );
        expect(unnamed).toBe(0);
    });
});
