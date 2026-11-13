import { Page, Locator } from '@playwright/test'

export class FavoritesPage {
  readonly page: Page
  readonly favoritesTitle: Locator
  readonly emptyStateMessage: Locator
  readonly heartIcon: Locator
  readonly productGrid: Locator
  readonly productCards: Locator
  readonly exploreProductsLink: Locator

  constructor(page: Page) {
    this.page = page
    this.favoritesTitle = page.locator('h1').first()
    this.emptyStateMessage = page.locator('text=Nenhum favorito ainda')
    this.heartIcon = page.locator('svg.lucide-heart')
    this.productGrid = page.locator('.grid.grid-cols-1')
    this.productCards = page.locator('.group.relative')
    this.exploreProductsLink = page.locator('a:has-text("Explorar produtos")')
  }

  async goto() {
    await this.page.goto('http://localhost:5173/favorites')
    await this.page.waitForLoadState('networkidle')
    await this.page.waitForSelector('body', { state: 'visible' })
  }

  async getFavoriteCount() {
    return await this.productCards.count()
  }

  async getIsEmpty() {
    return await this.emptyStateMessage.isVisible()
  }

  async isPageLoaded() {
    return await this.favoritesTitle.isVisible()
  }

  async clickFavoriteButton(productIndex: number = 0) {
    const card = this.productCards.nth(productIndex)
    const favoriteBtn = card.locator('button').last()
    await favoriteBtn.click()
  }

  async getProductTitle(productIndex: number = 0) {
    return await this.productCards.nth(productIndex).locator('h3').textContent()
  }

  async getProductPrice(productIndex: number = 0) {
    const card = this.productCards.nth(productIndex)
    // Look for price text with BRL currency format
    const priceText = card.locator('text', { has: 'R$' })
    return await priceText.textContent()
  }

  async getHeartIconState(productIndex: number = 0) {
    const card = this.productCards.nth(productIndex)
    const heartIcon = card.locator('svg').first()
    return await heartIcon.getAttribute('class')
  }

  async hasFilledHeart(productIndex: number = 0) {
    const card = this.productCards.nth(productIndex)
    const filledHeart = card.locator('svg.fill-current')
    return await filledHeart.count() > 0
  }
}
