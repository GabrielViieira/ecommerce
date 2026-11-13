import { IFav, favModel } from "../model/favModel.ts"

export const favRepository = {
    findByUser: async (userId: string): Promise<IFav | null> => {
        return await favModel.findOne({ userId }).populate("items")
    },
    findOne: async (userId: string): Promise<IFav | null> => {
        return await favModel.findOne({ userId })
    },
    create: async (userId: string): Promise<IFav> => {
        return await favModel.create({ userId, items: [] })
    },
    addItem: async (userId: string, productId: string): Promise<IFav | null> => {
        return await favModel.findOneAndUpdate(
            { userId },
            { $addToSet: { items: productId } },
            {returnDocument: 'after'}
        ).populate("items")
    },
    removeItem: async (userId: string, productId: string): Promise<IFav | null> => {
        return await favModel.findOneAndUpdate(
            { userId },
            { $pull: { items: productId } },
            {returnDocument: 'after'}
        ).populate("items")
    },
    clear: async (userId: string): Promise<IFav | null> => {
        return await favModel.findOneAndUpdate(
            { userId },
            { $set: { items: [] } },
            {returnDocument: 'after'}
        )
    },
    isFavorite: async (userId: string, productId: string): Promise<boolean> => {
        const fav = await favModel.findOne({ userId, items: productId })
        return !!fav
    }
}