import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[name="username"]', 'ShaggyDogSpa')
  await page.fill('input[name="password"]', 'Admin2026!')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

// Verifies the render branches of the ImageField control that the upload test
// doesn't cover (A14 — every branch, not just the happy path). These are
// client-only state transitions, so they don't save (no data mutation).
test.describe('Visual media Replace control', () => {
  test('choose-existing → remove → empty-state branches render on a service image', async ({ page }) => {
    await login(page)
    await page.goto('/admin/services')
    await page.getByRole('row').filter({ hasText: 'Full Groom' }).getByRole('link', { name: 'Edit' }).click()

    const hidden = page.locator('input[name="imageId"]')

    // "Choose existing" opens the library grid; picking a thumbnail assigns that id.
    await page.getByRole('button', { name: /choose existing/i }).click()
    const picker = page.getByTestId('media-picker')
    await expect(picker).toBeVisible()
    await picker.locator('button').first().click()
    await expect(hidden).toHaveValue(/^\d+$/)

    // "Remove" clears the field and reveals the empty drop state.
    await page.getByRole('button', { name: /^remove$/i }).click()
    await expect(hidden).toHaveValue('')
    await expect(page.getByText(/drag & drop or click/i)).toBeVisible()
  })

  test('editing alt text on an image field persists to the media record', async ({ page }) => {
    // Uses "Cat Grooming" (its own image; not touched by the other media tests) so
    // the persisted alt edit can't race the drag-drop test on "Full Groom".
    await login(page)
    await page.goto('/admin/services')
    await page.getByRole('row').filter({ hasText: 'Cat Grooming' }).getByRole('link', { name: 'Edit' }).click()

    const alt = page.getByLabel('Alt text')
    await expect(alt).toBeVisible()
    const original = await alt.inputValue()
    const marker = `alt-edited-${Date.now()}`

    // Blur fires updateMediaAlt (a server action POST); wait for it before reloading.
    await alt.fill(marker)
    await Promise.all([
      page.waitForResponse((r) => r.request().method() === 'POST' && r.status() === 200),
      alt.blur(),
    ])
    await page.reload()
    await expect(page.getByLabel('Alt text')).toHaveValue(marker) // persisted to the DB

    // Restore so the test is re-runnable.
    await page.getByLabel('Alt text').fill(original)
    await Promise.all([
      page.waitForResponse((r) => r.request().method() === 'POST' && r.status() === 200),
      page.getByLabel('Alt text').blur(),
    ])
  })

  test('the globals editor renders the Replace control for the branding logo', async ({ page }) => {
    await login(page)
    await page.goto('/admin/globals/branding')
    // The logo image field's drop input is present (proves ImageField renders here too).
    await expect(page.locator('input[name="logoId__file"]')).toHaveCount(1)
    await expect(page.locator('input[name="faviconId__file"]')).toHaveCount(1)
  })
})
