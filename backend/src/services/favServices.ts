import { favRepository } from "../repositories/favData.ts"

export const favServices = {
    getFavorites: async (userId: string) => {
        const fav = await favRepository.findByUser(userId)
        return fav?.items || []
    },
    toggleFavorite: async (userId: string, productId: string) => {
        const fav = await favRepository.findOne(userId)
        const isFav = fav?.items.some((id: any) => id.toString() === productId) || false

        if (isFav) {
            return await favRepository.removeItem(userId, productId)
        } else {
            return await favRepository.addItem(userId, productId)
        }
    },
    addFavorite: async (userId: string, productId: string) => {
        return await favRepository.addItem(userId, productId)
    },
    removeFavorite: async (userId: string, productId: string) => {
        return await favRepository.removeItem(userId, productId)
    },
    clearFavorites: async (userId: string) => {
        return await favRepository.clear(userId)
    },
    checkFavorite: async (userId: string, productId: string) => {
        return await favRepository.isFavorite(userId, productId)
    }
}