import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
  await page.goto('/manage/login')
  await page.fill('input[name="username"]', 'ShaggyDogSpa')
  await page.fill('input[name="password"]', 'Admin2026!')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/manage$/)
}

test.describe('Audit remediation', () => {
  // F4: the upload/relationship dropdown field inside a form was previously untested.
  test('a service image (upload field) round-trips through save + reload', async ({ page }) => {
    await login(page)
    await page.goto('/manage/services')
    await page.getByRole('row').filter({ hasText: 'Full Groom' }).getByRole('link', { name: 'Edit' }).click()

    const select = page.locator('select[name="imageId"]')
    await expect(select).toBeVisible()
    await select.selectOption({ index: 2 }) // a specific, non-empty media option
    const chosen = await select.inputValue()
    expect(chosen).not.toBe('')

    await page.getByRole('button', { name: /^save$/i }).click()
    await expect(page).toHaveURL(/\/manage\/services$/)

    // Reopen and confirm the chosen image persisted (proves the field wrote to the DB).
    await page.getByRole('row').filter({ hasText: 'Full Groom' }).getByRole('link', { name: 'Edit' }).click()
    await expect(page.locator('select[name="imageId"]')).toHaveValue(chosen)
  })

  // F2: SVG (potential active content) must be rejected by the upload validation.
  test('media upload rejects an SVG file', async ({ page }) => {
    await login(page)
    await page.goto('/manage/media')
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>'
    await page.setInputFiles('input[name="file"]', {
      name: 'evil.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from(svg),
    })
    await page.fill('input[name="alt"]', 'should be rejected')
    await page.getByRole('button', { name: /^upload$/i }).click()
    await expect(page.getByText(/only png, jpeg, webp, gif, or avif/i)).toBeVisible()
  })
})
