import { Page } from '@playwright/test'

export class AuthHelper {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async loginAsGuest() {
    // Navigate without authentication - guest mode
    // Just go to favorites page directly - guest mode is default
    await this.page.goto('http://localhost:5173/favorites')
    await this.page.waitForLoadState('networkidle')
  }

  async gotoRoot() {
    await this.page.goto('http://localhost:5173/')
    await this.page.waitForLoadState('networkidle')
  }

  async login(username: string, password: string) {
    await this.page.goto('http://localhost:5173/')
    await this.page.waitForLoadState('networkidle')

    // Fill login form
    await this.page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', username)
    await this.page.fill('input[type="password"], input[name="password"], input[placeholder*="senha" i]', password)

    // Click login button
    await this.page.click('button[type="submit"], button', { timeout: 5000 })
    await this.page.waitForLoadState('networkidle')
  }

  async logout() {
    // Click user menu button
    const userMenuButton = this.page.locator('button:has-text("User"), button[aria-label*="user"], .user-round').first()
    await userMenuButton.click()
    
    // Click logout
    const logoutBtn = this.page.locator('text=Log out, text=Logout')
    await logoutBtn.waitFor({ state: 'visible', timeout: 5000 })
    await logoutBtn.click()
    
    await this.page.waitForLoadState('networkidle')
  }

  async isLoggedIn() {
    // Check if user menu shows logged-in state (not guest)
    // Guest shows "Guest" username
    const usernameText = await this.page.locator('.text-sm').first().textContent()
    return usernameText !== null && usernameText !== 'Guest'
  }

  async getUserMenuVisible() {
    const userButton = this.page.locator('button:has-text("User"), .user-round')
    return await userButton.isVisible()
  }

  async getLogoutButtonVisible() {
    const logoutBtn = this.page.locator('text=Log out')
    return await logoutBtn.isVisible()
  }

  async getLoginSignupVisible() {
    const loginLink = this.page.locator('text=Login, text=Sign up, a[href="/"]')
    return await loginLink.first().isVisible()
  }

  async isGuestUser() {
    // Check if the username displayed is "Guest"
    const guestText = this.page.locator('text=Guest')
    return await guestText.isVisible()
  }
}
