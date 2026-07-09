import { test, expect } from '@playwright/test'

test.describe('Lead form', () => {
  test('submits a quote request and shows the confirmation', async ({ page }) => {
    await page.goto('/')

    // The hero quote form (required fields: full name + phone).
    await page.fill('input[name="fullName"]', 'Playwright Tester')
    await page.fill('input[name="phone"]', '760-555-0100')

    await page.getByRole('button', { name: /request my appointment/i }).click()

    // Server action succeeded → the form swaps to the success state.
    await expect(page.getByText(/request received/i)).toBeVisible()
  })
})
