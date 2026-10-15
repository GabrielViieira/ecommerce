import { Request, Response } from "express"
import * as cartServices from "../services/cartServices.ts"
import { Types } from "mongoose"

export const getCart = async (req: Request, res: Response) => {

    try {
        const userId = new Types.ObjectId((req as any).user._id)
        const cart = await cartServices.getCartService(userId)
        // console.log("ID vindo do Token:", (req as any).user._id)
        res.json(cart)
    } catch (err) {
        res.status(500).json({ err: "Erro ao buscar carrinho" })
    }
}

export const addItem = async (req: Request, res: Response) => {
    try {
        const userId = new Types.ObjectId((req as any).user._id)
        const { productId } = req.body
        const item = new Types.ObjectId(productId)
        const cart = await cartServices.addItemService(userId, item)

        res.json(cart)
    } catch (err: any) {
        console.error(err)
        return res.status(400).json({
            message: "Erro ao adicionar produto",
            error: err?.message ?? String(err),
        })
    }
}

export const removeItem = async (req: Request, res: Response) => {
    try {
        const userId = new Types.ObjectId((req as any).user._id)
        const { productId } = req.body

        if (!productId) {
            return res.status(400).json({ err: "ID do produto não enviado" })
        }

        const itemObjectId = new Types.ObjectId(productId)
        const cart = await cartServices.decItemsService(userId, itemObjectId)

        res.status(200).json(cart);
    } catch (error) {
        console.error(error)
        res.status(500).json({ err: "Erro ao remover item carrinho" })
    }
}

export const cleanCart = async (req: Request, res: Response) => {
    try {
        const user = new Types.ObjectId((req as any).user._id)
        const cart = await cartServices.clearCartService(user)

        res.json(cart)
    } catch (error) {
        res.status(500).json({ err: "Erro ao limpar carrinho" })
    }
}