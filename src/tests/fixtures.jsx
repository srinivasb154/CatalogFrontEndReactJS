import { test as base, expect } from '@playwright/experimental-ct-react';

// Extend Playwright test with reusable fixtures
export const test = base.extend({
  mockCategoryAndBrandAPI: async ({ page }, use) => {
    // Mock API for categories
    await page.route('**/api/categories', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: [
          { _id: 'cat1', categoryName: 'Electronics' },
          { _id: 'cat2', categoryName: 'Appliances' },
        ],
      })
    );

    // Mock API for brands
    await page.route('**/api/brands', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: [
          { _id: 'brand1', brandName: 'Samsung' },
          { _id: 'brand2', brandName: 'LG' },
        ],
      })
    );

    await use(); // Proceed to test execution
  },

  mockProductSubmissionAPI: async ({ page }, use) => {
    // Mock API for product submission
    await page.route('**/api/products', async (route) => {
      const request = await route.request();
      const payload = JSON.parse(await request.postData());

      // Validate payload
      if (!payload.productName || !payload.categoryId || !payload.brandId) {
        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: { error: 'Invalid form data' },
        });
      }

      // Successful response
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: { message: 'Product created successfully' },
      });
    });

    await use(); // Proceed to test execution
  },
});

export { expect };
