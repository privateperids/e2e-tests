import { test, expect } from '@playwright/test';

test.describe('E2E tests for https://e-commerce-kib.netlify.app/', () => {

    // Positive scenario: add a product
    test('Add a new product and verify', async ({ page }) => {
        await page.goto('https://e-commerce-kib.netlify.app/');

        // Navigate to the product page
        await page.getByRole('banner').getByRole('link').nth(1).click();

        // Fill product title
        await page.locator('input[name="title"]').fill('UltraSoft Wireless Headphones');

        // Fill product description
        await page.locator('input[name="description"]').fill('Experience high-quality sound with comfortable ear cushions and long-lasting battery life.');

        // Fill price
        await page.getByRole('spinbutton').fill('99');

        // Create the product
        await page.getByRole('button', { name: 'Create Product' }).click();

        // Verify product is visible
        await expect(page.getByText('UltraSoft Wireless Headphones')).toBeVisible();
    });

    // Negative scenario: try creating a product without required fields
    test('Fail to create product with empty title and price', async ({ page }) => {
        await page.goto('https://e-commerce-kib.netlify.app/');

        await page.getByRole('banner').getByRole('link').nth(1).click();

        // Leave title empty
        await page.locator('input[name="title"]').fill('');

        // Fill description
        await page.locator('input[name="description"]').fill('This is a product without a title.');

        // Leave price empty
        await page.getByRole('spinbutton').fill('');

        // Verify that an error message appears
        await expect(page.getByText('This field is required')).toBeVisible();

    });

    // Negative scenario: invalid price input
    test('Fail to create product with invalid price', async ({ page }) => {
        await page.goto('https://e-commerce-kib.netlify.app/');
        await page.getByRole('banner').getByRole('link').nth(1).click();

        await page.locator('input[name="title"]').fill('Invalid Price Product With wrong value');
        await page.locator('input[name="description"]').fill('Invalid Price Product With wrong value');
        await page.getByRole('spinbutton').fill('1'); // negative price

        await page.locator('input[name="title"]').click()

        // Verify validation error
        await expect(page.getByText('Min price is 30 !')).toBeVisible();
    });

    test.describe('E2E test for https://flutter-angular.web.app/', () => {
        const BASE_URL = 'https://flutter-angular.web.app/';

        // Positive scenario: click counter multiple times
        test('Click "+" button 4 times and verify visually', async ({ page }) => {
            await page.goto(BASE_URL);

            const canvas = page.locator('canvas');
            const box = await canvas.boundingBox();
            if (!box) throw new Error('Canvas not found');

            for (let i = 0; i < 4; i++) {
                await page.mouse.click(box.x + box.width - 50, box.y + box.height - 50);
                await page.waitForTimeout(500);
                await page.screenshot({ path: `counter-click-${i + 1}.png` });
            }

            await page.screenshot({ path: 'counter-final.png' });
        });
    });
});
