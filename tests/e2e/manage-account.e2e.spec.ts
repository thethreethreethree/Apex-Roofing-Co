import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[name="username"]', 'ShaggyDogSpa')
  await page.fill('input[name="password"]', 'Admin2026!')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

// These tests deliberately never complete a real password change: the admin
// password is shared across the whole suite, and the e2e files run in parallel
// locally, so mutating it would race the other login-based specs. They cover the
// route guard and both server-side rejection branches — all non-mutating. The
// successful-change + session-rotation path is verified in an isolated run.
test.describe('Custom admin — account / password', () => {
  test('anonymous visitor cannot reach the account page', async ({ page }) => {
    await page.goto('/admin/account')
    await expect(page).toHaveURL(/\/admin\/login$/)
  })

  test('a wrong current password is rejected and changes nothing', async ({ page }) => {
    await login(page)
    await page.goto('/admin/account')
    await page.fill('input[name="currentPassword"]', 'not-the-real-password')
    await page.fill('input[name="newPassword"]', 'BrandNewPass2026!')
    await page.fill('input[name="confirmPassword"]', 'BrandNewPass2026!')
    await page.getByRole('button', { name: /change password/i }).click()
    await expect(page.getByText(/current password is incorrect/i)).toBeVisible()

    // Prove the password really is unchanged: log out and back in with the original.
    await page.getByRole('link', { name: /back/i }).click()
    await expect(page).toHaveURL(/\/admin$/)
    await page.getByRole('button', { name: /log out/i }).click()
    await expect(page).toHaveURL(/\/admin\/login$/)
    await login(page)
  })

  test('a new-password / confirmation mismatch is rejected', async ({ page }) => {
    await login(page)
    await page.goto('/admin/account')
    await page.fill('input[name="currentPassword"]', 'Admin2026!')
    await page.fill('input[name="newPassword"]', 'MismatchOne2026!')
    await page.fill('input[name="confirmPassword"]', 'MismatchTwo2026!')
    await page.getByRole('button', { name: /change password/i }).click()
    await expect(page.getByText(/do not match/i)).toBeVisible()
  })
})
