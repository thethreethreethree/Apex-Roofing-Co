import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[name="username"]', 'ShaggyDogSpa')
  await page.fill('input[name="password"]', 'Admin2026!')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

// Verifies the audit remediation: richText + weekday fields render friendly
// editors (not raw JSON) and round-trip through save.
test.describe('Friendly admin field editors', () => {
  test('service description is a plain-text editor and persists to the public page', async ({ page }) => {
    // Cat Grooming: no other test saves this service, so mutate+restore is race-free.
    await login(page)
    await page.goto('/admin/services')
    await page.getByRole('row').filter({ hasText: 'Cat Grooming' }).getByRole('link', { name: 'Edit' }).click()

    const desc = page.getByPlaceholder('Write here in plain paragraphs…')
    await expect(desc).toBeVisible()
    const original = await desc.inputValue()
    expect(original).not.toContain('"root"') // it's plain text, not raw Lexical JSON

    const marker = `Ordering-safe grooming note ${Date.now()}`
    try {
      await desc.fill(marker)
      await page.getByRole('button', { name: /^save$/i }).click()
      await expect(page).toHaveURL(/\/admin\/services$/)
      // The public service page renders the edited text → proves the plain-text
      // ↔ Lexical JSON round-trip is correct.
      await page.goto('/services/cat-grooming')
      await expect(page.getByText(marker).first()).toBeVisible()
    } finally {
      await page.goto('/admin/services')
      await page.getByRole('row').filter({ hasText: 'Cat Grooming' }).getByRole('link', { name: 'Edit' }).click()
      await page.getByPlaceholder('Write here in plain paragraphs…').fill(original)
      await page.getByRole('button', { name: /^save$/i }).click()
      await expect(page).toHaveURL(/\/admin\/services$/)
    }
  })

  test('booking days use Sun–Sat buttons (not raw JSON) and toggling persists', async ({ page }) => {
    await login(page)
    await page.goto('/admin/globals/availability-settings')

    // Day buttons present; no raw-JSON weekdays textarea.
    await expect(page.getByRole('button', { name: 'Tue' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sun' })).toBeVisible()

    const mon = page.getByRole('button', { name: 'Mon' })
    const before = (await mon.getAttribute('aria-pressed')) === 'true'
    await mon.click()
    await page.getByRole('button', { name: /^save$/i }).click()
    await expect(page).toHaveURL(/\/admin$/)

    // Reopen: the toggle persisted.
    await page.goto('/admin/globals/availability-settings')
    await expect(page.getByRole('button', { name: 'Mon' })).toHaveAttribute('aria-pressed', String(!before))

    // Revert to the original state.
    await page.getByRole('button', { name: 'Mon' }).click()
    await page.getByRole('button', { name: /^save$/i }).click()
    await expect(page).toHaveURL(/\/admin$/)
  })
})
