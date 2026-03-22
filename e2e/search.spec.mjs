import { test, expect } from '@playwright/test';
import { mockAwesomeJson } from './fixtures.mjs';

test.beforeEach(async ({ page }) => {
  await mockAwesomeJson(page);
  await page.goto('/#/');
  await expect(page.getByTestId('home-page')).toBeVisible();
});

test('search input is visible', async ({ page }) => {
  await expect(page.getByTestId('search-input')).toBeVisible();
});

test('typing shows search results dropdown', async ({ page }) => {
  await page.getByTestId('search-input').fill('react');
  await expect(page.getByTestId('search-results')).toBeVisible();
  await expect(page.getByText('awesome-react')).toBeVisible();
});

test('shows empty state when no results match', async ({ page }) => {
  await page.getByTestId('search-input').fill('zzzzzzzzz');
  await expect(page.getByTestId('search-results')).toBeVisible();
  await expect(page.getByText('Type something to search')).toBeVisible();
});

test('clicking a result navigates to readme page', async ({ page }) => {
  await page.route('**/readme/enaqx/awesome-react', (route) =>
    route.fulfill({ body: '<h1>Awesome React</h1>' })
  );
  await page.route('**/api.github.com/**', (route) =>
    route.fulfill({ json: { stargazers_count: 100, pushed_at: '2024-01-01T00:00:00Z' } })
  );
  await page.getByTestId('search-input').fill('react');
  await page.getByTestId('search-result-link').first().click();
  await expect(page).toHaveURL(/#\/enaqx\/awesome-react/);
});

test('ArrowDown key highlights next result', async ({ page }) => {
  await page.getByTestId('search-input').fill('awesome');
  await expect(page.getByTestId('search-results')).toBeVisible();
  await page.getByTestId('search-input').press('ArrowDown');
  const firstItem = page.getByTestId('search-result-item').first();
  await expect(firstItem).toHaveClass(/SearchResultItemSelected/);
});

test('Tab key navigates to first result', async ({ page }) => {
  await page.route('**/readme/enaqx/awesome-react', (route) =>
    route.fulfill({ body: '<h1>Awesome React</h1>' })
  );
  await page.route('**/api.github.com/**', (route) =>
    route.fulfill({ json: { stargazers_count: 100, pushed_at: '2024-01-01T00:00:00Z' } })
  );
  await page.getByTestId('search-input').fill('react');
  await expect(page.getByTestId('search-results')).toBeVisible();
  await page.getByTestId('search-input').press('Tab');
  await expect(page).toHaveURL(/#\/enaqx\/awesome-react/);
});

test('results dropdown closes when clicking backdrop', async ({ page }) => {
  await page.getByTestId('search-input').fill('react');
  await expect(page.getByTestId('search-results')).toBeVisible();
  await page.locator('[data-testid="awesome-search"]').click({ position: { x: 10, y: 200 } });
  await expect(page.getByTestId('search-results')).not.toBeVisible();
});

test('results reappear after typing again', async ({ page }) => {
  await page.getByTestId('search-input').fill('react');
  await expect(page.getByTestId('search-results')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByTestId('search-input').fill('node');
  await expect(page.getByTestId('search-results')).toBeVisible();
});
