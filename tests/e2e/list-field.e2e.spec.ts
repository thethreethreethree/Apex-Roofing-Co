import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[name="username"]', 'ShaggyDogSpa')
  await page.fill('input[name="password"]', 'Admin2026!')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

// Friendly JSON-list editor (ListField). Uses the home-page "Trust bar" list —
// home-page isn't touched by other tests, so the mutate+restore is race-free.
test.describe('Admin friendly list editor', () => {
  test('trust badges: edit reflects on the homepage; add + remove branches work', async ({ page }) => {
    await login(page)
    await page.goto('/admin/globals/home-page')

    const field = page.getByTestId('list-trustBadges') // scope past the why-us list
    const badges = field.getByLabel('Badge text')
    await expect(badges.first()).toBeVisible()
    const original = await badges.first().inputValue()
    const marker = `Badge-${Date.now()}`

    try {
      // 1) Edit the first badge and save → the homepage hero shows it.
      await badges.first().fill(marker)
      await page.getByRole('button', { name: /^save$/i }).click()
      await expect(page).toHaveURL(/\/admin$/)
      await page.goto('/')
      await expect(page.getByText(marker).first()).toBeVisible()

      // 2) Add + Remove branches (client-only; no save needed to prove them).
      await page.goto('/admin/globals/home-page')
      const field2 = page.getByTestId('list-trustBadges')
      const before = await field2.getByLabel('Badge text').count()
      await field2.getByRole('button', { name: '+ Add' }).click()
      await expect(field2.getByLabel('Badge text')).toHaveCount(before + 1)
      await field2.getByRole('button', { name: 'Remove' }).last().click()
      await expect(field2.getByLabel('Badge text')).toHaveCount(before)
    } finally {
      // Restore the original first-badge label so the test is re-runnable.
      await page.goto('/admin/globals/home-page')
      await page.getByTestId('list-trustBadges').getByLabel('Badge text').first().fill(original)
      await page.getByRole('button', { name: /^save$/i }).click()
      await expect(page).toHaveURL(/\/admin$/)
    }
  })
})
