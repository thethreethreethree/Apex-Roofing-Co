import { test, expect, type Page } from '@playwright/test'

// A minimal valid 1×1 PNG.
const PNG_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

async function login(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[name="username"]', 'ShaggyDogSpa')
  await page.fill('input[name="password"]', 'Admin2026!')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

test.describe('Audit remediation', () => {
  // F4 (updated for the visual "Replace Image" control): dropping a new photo on a
  // service's image field uploads it, assigns a new media id to that field only,
  // and the assignment persists through save + reload.
  test('replacing a service image via drag-drop upload round-trips through save + reload', async ({ page }) => {
    await login(page)
    await page.goto('/admin/services')
    await page.getByRole('row').filter({ hasText: 'Full Groom' }).getByRole('link', { name: 'Edit' }).click()

    // The hidden input is what the form submits for this field.
    const hidden = page.locator('input[name="imageId"]')
    const before = await hidden.inputValue()

    // Drop a new photo onto the Replace-Image control (unique name per run).
    await page.setInputFiles('input[name="imageId__file"]', {
      name: `e2e-service-${Date.now()}.png`,
      mimeType: 'image/png',
      buffer: Buffer.from(PNG_B64, 'base64'),
    })

    // Upload completes → the field points at a new media id (changed from the original).
    await expect(hidden).not.toHaveValue(before)
    await expect(hidden).toHaveValue(/^\d+$/)
    const after = await hidden.inputValue()

    await page.getByRole('button', { name: /^save$/i }).click()
    await expect(page).toHaveURL(/\/admin\/services$/)

    // Reopen and confirm the new image persisted (proves the field wrote to the DB).
    await page.getByRole('row').filter({ hasText: 'Full Groom' }).getByRole('link', { name: 'Edit' }).click()
    await expect(page.locator('input[name="imageId"]')).toHaveValue(after)
  })

  // F2: SVG (potential active content) must be rejected by the upload validation.
  test('media upload rejects an SVG file', async ({ page }) => {
    await login(page)
    await page.goto('/admin/media')
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
