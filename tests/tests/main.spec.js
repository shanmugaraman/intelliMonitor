import { test, expect } from '@playwright/test';

test.describe('Intelli Power Monitor E2E', () => {
  test('should display login page', async ({ page }) => {
    // Vite defualt port
    try {
      await page.goto('http://localhost:5173');
    } catch {
      // Create react app port fallback
      try {
        await page.goto('http://localhost:3000');
      } catch {
        console.log("No dev server responded");
      }
    }
    await expect(page).toHaveTitle(/Intelli Power Monitor/);
    await expect(page.locator('h1')).toHaveText('Intelli Power');
  });

  test('should render sign in inputs', async ({ page }) => {
    try {
      await page.goto('http://localhost:5173');
    } catch {
      await page.goto('http://localhost:3000');
    }
    
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign In');
  });
});
