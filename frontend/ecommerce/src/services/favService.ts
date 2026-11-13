const GUEST_FAVORITES_KEY = 'guest_favorites'

export function getGuestFavorites(): string[] {
  try {
    const stored = localStorage.getItem(GUEST_FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading guest favorites:', error)
    return []
  }
}

export function addGuestFavorite(productId: string): string[] {
  try {
    const favorites = getGuestFavorites()
    if (!favorites.includes(productId)) {
      const updated = [...favorites, productId]
      localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(updated))
      return updated
    }
    return favorites
  } catch (error) {
    console.error('Error adding guest favorite:', error)
    return getGuestFavorites()
  }
}

export function removeGuestFavorite(productId: string): string[] {
  try {
    const favorites = getGuestFavorites()
    const updated = favorites.filter(id => id !== productId)
    localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(updated))
    return updated
  } catch (error) {
    console.error('Error removing guest favorite:', error)
    return getGuestFavorites()
  }
}

export function toggleGuestFavorite(productId: string): string[] {
  try {
    const favorites = getGuestFavorites()
    if (favorites.includes(productId)) {
      return removeGuestFavorite(productId)
    } else {
      return addGuestFavorite(productId)
    }
  } catch (error) {
    console.error('Error toggling guest favorite:', error)
    return getGuestFavorites()
  }
}

export function checkGuestFavorite(productId: string): boolean {
  const favorites = getGuestFavorites()
  return favorites.includes(productId)
}

export function clearGuestFavorites(): void {
  try {
    localStorage.removeItem(GUEST_FAVORITES_KEY)
  } catch (error) {
    console.error('Error clearing guest favorites:', error)
  }
}