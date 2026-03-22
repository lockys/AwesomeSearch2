import { test, expect } from '@playwright/test';
import { mockAwesomeJson } from './fixtures.mjs';

test.beforeEach(async ({ page }) => {
  await mockAwesomeJson(page);
});

test('shortcuts page loads at /#/shortcuts', async ({ page }) => {
  await page.goto('/#/shortcuts');
  await expect(page.getByRole('heading', { name: /keyboard shortcuts/i })).toBeVisible();
});

test('shortcuts page shows all three shortcuts', async ({ page }) => {
  await page.goto('/#/shortcuts');
  await expect(page.getByText('Jump to first search result')).toBeVisible();
  await expect(page.getByText('Navigate through search results')).toBeVisible();
  await expect(page.getByText('Open selected result')).toBeVisible();
});

test('shortcuts page shows key badges', async ({ page }) => {
  await page.goto('/#/shortcuts');
  await expect(page.locator('kbd', { hasText: 'Tab' })).toBeVisible();
  await expect(page.locator('kbd', { hasText: 'Enter' })).toBeVisible();
});

test('back link navigates to homepage', async ({ page }) => {
  await page.goto('/#/shortcuts');
  await page.getByRole('link', { name: '← Back' }).click();
  await expect(page).toHaveURL('/#/');
  await expect(page.getByTestId('home-page')).toBeVisible();
});

test('homepage keyboard shortcuts link goes to shortcuts page', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('home-page')).toBeVisible();
  await page.getByRole('link', { name: /keyboard shortcuts/i }).click();
  await expect(page).toHaveURL('/#/shortcuts');
  await expect(page.getByRole('heading', { name: /keyboard shortcuts/i })).toBeVisible();
});
