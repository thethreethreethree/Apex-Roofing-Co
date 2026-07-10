import { test, expect } from '@playwright/test'

/** Full CRUD through the custom admin: create, edit, and delete a review. */
test.describe('Custom admin CRUD (/admin)', () => {
  test('create, edit, and delete a review', async ({ page }) => {
    // Login
    await page.goto('/admin/login')
    await page.fill('input[name="username"]', 'ShaggyDogSpa')
    await page.fill('input[name="password"]', 'Admin2026!')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/admin$/)

    // Reviews list
    await page.locator('a[href="/admin/reviews"]').click()
    await expect(page).toHaveURL(/\/admin\/reviews$/)

    // Create
    await page.locator('a[href="/admin/reviews/new"]').click()
    await page.fill('input[name="author"]', 'E2E CRUD Tester')
    await page.fill('input[name="rating"]', '5')
    await page.fill('textarea[name="text"]', 'A review created through the custom admin.')
    await page.getByRole('button', { name: /^save$/i }).click()
    await expect(page).toHaveURL(/\/admin\/reviews$/)
    await expect(page.getByText('E2E CRUD Tester')).toBeVisible()

    // Edit
    await page.getByRole('row', { name: /E2E CRUD Tester/ }).getByRole('link', { name: 'Edit' }).click()
    await page.fill('input[name="author"]', 'E2E CRUD Tester EDITED')
    await page.getByRole('button', { name: /^save$/i }).click()
    await expect(page).toHaveURL(/\/admin\/reviews$/)
    await expect(page.getByText('E2E CRUD Tester EDITED')).toBeVisible()

    // Delete
    await page.getByRole('row', { name: /E2E CRUD Tester EDITED/ }).getByRole('link', { name: 'Edit' }).click()
    await page.getByRole('button', { name: /delete this review/i }).click()
    await expect(page).toHaveURL(/\/admin\/reviews$/)
    await expect(page.getByText('E2E CRUD Tester EDITED')).toHaveCount(0)
  })
})
