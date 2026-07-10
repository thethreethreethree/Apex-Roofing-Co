import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[name="username"]', 'ShaggyDogSpa')
  await page.fill('input[name="password"]', 'Admin2026!')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

test.describe('Admin list ordering', () => {
  test('content list respects the configured order (services, asc)', async ({ page }) => {
    await login(page)
    await page.goto('/admin/services')
    const texts = await page.locator('tbody tr').allInnerTexts()
    const idxFull = texts.findIndex((t) => /Full Groom/.test(t)) // seeded order 1
    const idxCat = texts.findIndex((t) => /Cat Grooming/.test(t)) // seeded order 6
    expect(idxFull).toBeGreaterThanOrEqual(0)
    expect(idxCat).toBeGreaterThan(idxFull)
  })

  test('a newly created record appears first (newest-first, id desc)', async ({ page }) => {
    // Uses Gallery/projects — no other test creates projects, so this is race-free.
    await login(page)
    await page.goto('/admin/projects/new')
    const title = `ZZZ Order Test ${Date.now()}`
    await page.fill('input[name="title"]', title)
    await page.getByRole('button', { name: /^save$/i }).click()
    await expect(page).toHaveURL(/\/admin\/projects$/)

    // The just-created project has the highest id → it must be the first row.
    await expect(page.locator('tbody tr').first()).toContainText(title)

    // Clean up so the test is re-runnable.
    await page.getByRole('row').filter({ hasText: title }).getByRole('link', { name: 'Edit' }).click()
    await page.getByRole('button', { name: /delete this/i }).click()
    await expect(page).toHaveURL(/\/admin\/projects$/)
  })
})
