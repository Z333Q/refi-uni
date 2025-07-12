import { test, expect } from '@playwright/test'

test('connect and deploy', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Connect')
  await page.click('text=Deploy Agent')
  await page.waitForURL('/portfolio')
  await expect(page.locator('text=Trade Stream')).toBeVisible()
})
