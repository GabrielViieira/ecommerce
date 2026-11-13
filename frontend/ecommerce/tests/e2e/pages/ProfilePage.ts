import { Page, Locator } from '@playwright/test'

export class ProfilePage {
  readonly page: Page
  readonly favoritesSectionTitle: Locator
  readonly favoritesSection: Locator
  readonly heartIcon: Locator
  readonly emptyFavoritesMessage: Locator
  readonly favoriteItems: Locator
  readonly loadingSpinner: Locator
  readonly profileSettingsTitle: Locator

  constructor(page: Page) {
    this.page = page
    this.favoritesSectionTitle = page.locator('h2:has-text("Favorite Products")')
    this.favoritesSection = page.locator('section').filter({ has: page.locator('h2:has-text("Favorite Products")') })
    this.heartIcon = page.locator('svg.text-muted:has(path.fill-current)')
    this.emptyFavoritesMessage = page.locator('text=Você ainda não tem produtos favoritos')
    this.favoriteItems = page.locator('.grid.grid-cols-1 a[href^="/pagina-produto/"]')
    this.loadingSpinner = page.locator('.animate-spin')
    this.profileSettingsTitle = page.locator('h2:has-text("Profile Settings")')
  }

  async goto() {
    await this.page.goto('http://localhost:5173/user/testuser')
    await this.page.waitForLoadState('networkidle')
  }

  async waitForUserLoad() {
    // Wait for the profile page to finish loading user data
    // For unauthenticated users, it shows a loading spinner
    await this.page.waitForLoadState('networkidle')
  }

  async isLoading() {
    // Check if the loading spinner is visible (unauthenticated state)
    return await this.loadingSpinner.first().isVisible()
  }

  async isProfileVisible() {
    // Check if the profile section is visible (authenticated state)
    return await this.profileSettingsTitle.isVisible()
  }

  async isVisible() {
    return await this.favoritesSectionTitle.isVisible()
  }

  async getFavoriteCount() {
    return await this.favoriteItems.count()
  }

  async isEmptyStateVisible() {
    return await this.emptyFavoritesMessage.isVisible()
  }

  async getHeartIconCount() {
    return await this.heartIcon.count()
  }

  async hasHeartIcon() {
    return await this.heartIcon.count() > 0
  }
}
