import { test, expect } from '@playwright/test'

test.describe('Header Behavior - Guest vs Logged-in', () => {

  test('should load favorites page as guest', async ({ page }) => {
    await page.goto('http://localhost:5173/favorites')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('Favoritos')
  })

  test('should show empty state with heart icon', async ({ page }) => {
    await page.goto('http://localhost:5173/favorites')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('text=Nenhum favorito ainda')).toBeVisible()
    await expect(page.locator('svg.lucide-heart')).toBeVisible()
  })

  test('should show Explore products link when empty', async ({ page }) => {
    await page.goto('http://localhost:5173/favorites')
    await page.waitForLoadState('networkidle')

    const exploreLink = page.locator('a:has-text("Explorar produtos")')
    await expect(exploreLink).toBeVisible()
  })

  test('favorites page should be accessible without login', async ({ page }) => {
    await page.goto('http://localhost:5173/favorites')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('Favoritos')
  })

  test('header contains navigation elements on favorites page', async ({ page }) => {
    await page.goto('http://localhost:5173/favorites')
    await page.waitForLoadState('networkidle')

    // Check that header contains the logo/brand
    await expect(page.locator('text=SILENT')).toBeVisible()
  })

  test('header shows Favoritos navigation link', async ({ page }) => {
    await page.goto('http://localhost:5173/favorites')
    await page.waitForLoadState('networkidle')

    // Check that Favoritos link is in the header navigation
    await expect(page.locator('a:has-text("Favoritos")')).toBeVisible()
  })
})