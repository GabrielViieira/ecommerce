import { Request, Response } from "express"
import { favServices } from "../services/favServices.ts"

export const getFavorites = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id
        const favorites = await favServices.getFavorites(userId)
        res.json(favorites)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const toggleFavorite = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id
        const { productId } = req.body
        const result = await favServices.toggleFavorite(userId, productId)
        res.json(result)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const addFavorite = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id
        const { productId } = req.body
        const result = await favServices.addFavorite(userId, productId)
        res.json(result)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const removeFavorite = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id
        const { productId } = req.body
        const result = await favServices.removeFavorite(userId, productId)
        res.json(result)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const checkFavorite = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id
        const { productId } = req.params
        const isFav = await favServices.checkFavorite(userId, productId)
        res.json({ isFavorite: isFav })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}