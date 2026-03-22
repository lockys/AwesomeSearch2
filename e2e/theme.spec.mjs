import { test, expect } from '@playwright/test';
import { mockAwesomeJson } from './fixtures.mjs';

test.beforeEach(async ({ page }) => {
  await mockAwesomeJson(page);
  await page.goto('/#/');
  await expect(page.getByTestId('home-page')).toBeVisible();
});

test('starts in light mode by default', async ({ page }) => {
  await expect(page.locator('.hack')).not.toHaveClass(/solarized-dark/);
});

test('clicking theme toggle switches to dark mode', async ({ page }) => {
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  await expect(page.locator('.hack')).toHaveClass(/solarized-dark/);
});

test('dark mode persists on page reload', async ({ page }) => {
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  await page.reload();
  await expect(page.getByTestId('home-page')).toBeVisible();
  await expect(page.locator('.hack')).toHaveClass(/solarized-dark/);
});

test('clicking theme toggle again switches back to light mode', async ({ page }) => {
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  await expect(page.locator('.hack')).toHaveClass(/solarized-dark/);
  await page.getByRole('button', { name: /switch to light mode/i }).click();
  await expect(page.locator('.hack')).not.toHaveClass(/solarized-dark/);
});
