import { test, expect } from '@playwright/test'
import { FavoritesPage } from '../pages/FavoritesPage'

test.describe('Favorites Feature', () => {
  let favoritesPage: FavoritesPage

  test.beforeEach(async ({ page }) => {
    favoritesPage = new FavoritesPage(page)
  })

  test('should load the favorites page', async ({ page }) => {
    await favoritesPage.goto()

    // Check that the page loads with title - use first() to avoid strict mode violation
    await expect(favoritesPage.favoritesTitle.first()).toBeVisible()
    await expect(favoritesPage.favoritesTitle.first()).toContainText('Favoritos')
  })

  test('should show empty state when no favorites', async ({ page }) => {
    await favoritesPage.goto()

    // Check for empty state message
    await expect(favoritesPage.emptyStateMessage).toBeVisible()
  })

  test('should display heart icons on favorite buttons', async ({ page }) => {
    await favoritesPage.goto()

    // On page load, check that the heart icon component exists
    // The favorites page uses a grid layout for products
    const products = page.locator('.group.relative')
    const productCount = await products.count()

    if (productCount === 0) {
      // Empty state - heart icon should be visible (lucide-heart class)
      const emptyHeart = page.locator('svg.lucide-heart')
      await expect(emptyHeart).toBeVisible()
    } else {
      // Products exist - check for heart icons in each product
      const heartIcons = page.locator('.group.relative button svg')
      await expect(heartIcons.first()).toBeVisible()
    }
  })

  test('should toggle favorite button - add to favorites', async ({ page }) => {
    await favoritesPage.goto()

    // Check if there are products on the page to add to favorites
    const productCards = page.locator('.group.relative')
    const count = await productCards.count()

    if (count > 0) {
      // Find the favorite button (heart icon) on a product card
      const favoriteButton = productCards.first().locator('button')

      // Click on the favorite button
      await favoriteButton.click()

      // Verify success toast appears
      await expect(page.locator('text=Adicionado aos favoritos')).toBeVisible({ timeout: 10000 })
    }
  })

  test('should display product information correctly in favorites', async ({ page }) => {
    await favoritesPage.goto()

    // Get favorite items
    const items = page.locator('.group.relative')
    const hasFavorites = await items.count() > 0

    if (hasFavorites) {
      const firstItem = items.first()

      // Verify product title
      await expect(firstItem.locator('h3')).toBeVisible()

      // Verify price is displayed (BRL currency)
      const priceElement = firstItem.locator('text')
      await expect(priceElement).toBeVisible()
    } else {
      // Verify empty state message
      await expect(page.locator('text=Nenhum favorito ainda')).toBeVisible()
    }
  })

  test('should show filled heart icon for favorited items', async ({ page }) => {
    await favoritesPage.goto()

    const items = page.locator('.group.relative')
    const itemCount = await items.count()

    if (itemCount > 0) {
      // Check if heart has fill-current class (filled heart)
      const heartIcon = items.first().locator('svg.fill-current')
      await expect(heartIcon.first()).toBeVisible()
    }
  })

  test('should navigate to product page from favorites', async ({ page }) => {
    await favoritesPage.goto()

    const items = page.locator('.group.relative a')
    const itemCount = await items.count()

    if (itemCount > 0) {
      await items.first().click()
      await page.waitForLoadState('networkidle')

      // Should be on a product page
      await expect(page.locator('[data-testid="product-page"], .product-title, h1, h3')).toBeVisible({ timeout: 10000 })
    }
  })
})