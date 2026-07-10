import { test, expect } from '@playwright/test'

test.describe('Custom admin auth (/admin)', () => {
  test('anonymous visitor is redirected to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login$/)
  })

  test('wrong password rejected; correct login reaches dashboard; logout ends session', async ({ page }) => {
    await page.goto('/admin/login')

    // Wrong password → generic error, stays on login.
    await page.fill('input[name="username"]', 'ShaggyDogSpa')
    await page.fill('input[name="password"]', 'definitely-wrong')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/invalid username or password/i)).toBeVisible()

    // Correct password → dashboard.
    await page.fill('input[name="password"]', 'Admin2026!')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/admin$/)
    await expect(page.getByText(/signed in as ShaggyDogSpa/i)).toBeVisible()

    // Logout → back to login, and /admin is protected again.
    await page.getByRole('button', { name: /log out/i }).click()
    await expect(page).toHaveURL(/\/admin\/login$/)
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login$/)
  })
})
