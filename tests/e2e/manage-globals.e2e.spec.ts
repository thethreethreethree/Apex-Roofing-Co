import { test, expect } from '@playwright/test'

const MARKER = 'TAGLINE-EDITED-VIA-ADMIN'
const ORIGINAL = 'Grooming That Comes to You'

async function login(page: import('@playwright/test').Page) {
  await page.goto('/admin/login')
  await page.fill('input[name="username"]', 'ShaggyDogSpa')
  await page.fill('input[name="password"]', 'Admin2026!')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

async function setTagline(page: import('@playwright/test').Page, value: string) {
  await page.goto('/admin/globals/site-settings')
  await page.fill('input[name="tagline"]', value)
  await page.getByRole('button', { name: /^save$/i }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

test.describe('Custom admin globals editor', () => {
  test('editing the site tagline reflects on the public site', async ({ page }) => {
    await login(page)
    try {
      await setTagline(page, MARKER)
      // Public footer shows the tagline — proves the edit wrote to the shared custom DB.
      await page.goto('/')
      await expect(page.getByText(new RegExp(MARKER)).first()).toBeVisible()
    } finally {
      // Always revert so re-runs are clean.
      await setTagline(page, ORIGINAL)
    }
  })
})
