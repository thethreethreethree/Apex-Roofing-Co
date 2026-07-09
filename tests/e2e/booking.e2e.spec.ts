import { test, expect } from '@playwright/test'

test.describe('Booking flow', () => {
  test('books an appointment end-to-end', async ({ page }) => {
    await page.goto('/book')

    // A date is preselected; pick the first available time slot (e.g. "9:00 AM").
    const timeButton = page.getByRole('button', { name: /^\d{1,2}:\d{2}\s?(AM|PM)$/ }).first()
    await expect(timeButton).toBeVisible()
    await timeButton.click()

    // Advance to the details step.
    await page.getByRole('button', { name: /^continue$/i }).click()

    // Fill the required details and confirm.
    await page.fill('input[name="name"]', 'Playwright Booker')
    await page.fill('input[name="phone"]', '760-555-0199')
    await page.getByRole('button', { name: /confirm booking/i }).click()

    // Success screen.
    await expect(page.getByText(/you'?re booked/i)).toBeVisible()
  })
})
