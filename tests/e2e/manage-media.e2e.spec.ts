import { test, expect } from '@playwright/test'

// A minimal valid 1×1 PNG.
const PNG_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

test.describe('Custom admin media library', () => {
  test('upload a photo and it appears + serves', async ({ page }) => {
    await page.goto('/admin/login')
    await page.fill('input[name="username"]', 'ShaggyDogSpa')
    await page.fill('input[name="password"]', 'Admin2026!')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/admin$/)

    // Unique filename per run so the upload never collides with a prior run's file
    // (a collision would de-dup to a different name and break the assertions).
    const name = `e2e-upload-${Date.now()}.png`
    await page.goto('/admin/media')
    await page.setInputFiles('input[name="file"]', {
      name,
      mimeType: 'image/png',
      buffer: Buffer.from(PNG_B64, 'base64'),
    })
    await page.fill('input[name="alt"]', 'E2E uploaded image')
    await page.getByRole('button', { name: /^upload$/i }).click()

    // The new file appears in the library after refresh.
    await expect(page.getByText(name).first()).toBeVisible()

    // And it actually serves from the custom media route.
    const res = await page.request.get(`/media-file/${name}`)
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('image/png')
  })
})
