import { test, expect } from '@playwright/test';
import { mockAwesomeJson, AWESOME_JSON_URL } from './fixtures.mjs';

test.beforeEach(async ({ page }) => {
  await mockAwesomeJson(page);
});

test('shows spinner while loading', async ({ page }) => {
  // Override mock with a slow response
  await page.route(AWESOME_JSON_URL, async (route) => {
    await new Promise((r) => setTimeout(r, 1000));
    route.fulfill({ json: { 'Front-End': [] } });
  });
  await page.goto('/#/');
  // Spinner appears before data resolves
  await expect(page.locator('.loading')).toBeVisible({ timeout: 2000 });
});

test('renders homepage after data loads', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('home-page')).toBeVisible();
});

test('shows domain migration notice banner', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('home-page')).toBeVisible();
  await expect(page.getByText(/moving to a new domain/i)).toBeVisible();
  // Scope to first match to avoid strict mode violation
  await expect(page.getByRole('link', { name: 'awesomelists.calvinjeng.io' }).first()).toBeVisible();
});

test('shows hero section with title', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('home-page')).toBeVisible();
  await expect(page.getByRole('heading', { name: /awesome search/i })).toBeVisible();
});

test('shows keyboard shortcuts link in Get Started section', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('home-page')).toBeVisible();
  await expect(page.getByRole('link', { name: /keyboard shortcuts/i })).toBeVisible();
});

test('shows category list in sidebar after load', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('home-page')).toBeVisible();
  const categoryLinks = page.getByTestId('category-link');
  await expect(categoryLinks.filter({ hasText: 'Front-End' })).toBeVisible();
  await expect(categoryLinks.filter({ hasText: 'Back-End' })).toBeVisible();
});

test('clicking a category shows its items', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('home-page')).toBeVisible();
  await page.getByTestId('category-link').filter({ hasText: 'Front-End' }).click();
  await expect(page.getByTestId('list-grid')).toBeVisible();
  await expect(page.getByText('awesome-react')).toBeVisible();
  await expect(page.getByText('awesome-vue')).toBeVisible();
});
