import { test, expect } from './fixtures.jsx';
import CreateProducts from '../src/components/product/CreateProducts.jsx';

test.describe('CreateProduct Component', () => {
  test.use({ mockCategoryAndBrandAPI: true });

  test('renders all form fields correctly', async ({ mount }) => {
    const component = await mount(<CreateProducts />);

    // Check form fields
    await expect(component.locator('text=Create New Product')).toBeVisible();
    await expect(component.locator('label:has-text("Product Name")')).toBeVisible();
    await expect(component.locator('label:has-text("Category")')).toBeVisible();
    await expect(component.locator('label:has-text("Brand")')).toBeVisible();
    await expect(component.locator('button:has-text("Submit")')).toBeVisible();
  });

  /* test.use({ mockProductSubmissionAPI: true }); // Use the product submission mock
  test('allows submitting valid product data', async ({ mount, page }) => {
    const component = await mount(<CreateProducts />);

    // Fill out the form
    await component.locator('[placeholder="product-name"]').fill('Test Product');
    await component.locator('[placeholder="sku"]').fill('TEST123');
    await component.locator('[placeholder="short-description"]').fill('Short Desc');
    // await component.locator('[placeholder="category"]').selectOption({ label: 'Electronics' });
    // await component.locator('[placeholder="brand"]').selectOption({ label: 'Samsung' });

    // Submit the form
    await component.locator('[placeholder="submit"]').click();

    // Verify success message
    //await expect(component.locator('text=Product created successfully')).toBeVisible();
    //await expect(component).toContainText('Product created successfully');
    //await expect(page.locator('text=Product created successfully')).toBeVisible();
    await expect(page).toContainText('Product created successfully');
    page.close();
  }); */

  /* test.use({ mockProductSubmissionAPI: true }); // Use the product submission mock
  test('displays error for invalid form submission', async ({ mount }) => {
    const component = await mount(<CreateProducts />);

    // Leave required fields empty
    await component.locator('label:has-text("Product Name") >> input').fill('');
    await component.locator('button:has-text("Submit")').click();

    // Verify error message
    await expect(component.locator('text=Invalid form data')).toBeVisible();
  }); */
});
