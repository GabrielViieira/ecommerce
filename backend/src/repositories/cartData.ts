import { Types } from "mongoose"
import { cartModel } from "../model/cartModel"



export const cartRepository = {
    findCartByUser: async(id: Types.ObjectId) =>{
        return await cartModel.findOne({userId: id}).populate('items.productId')
    },
    create: async(id: Types.ObjectId) =>{
        return await cartModel.create({userId: id})
    },
    itemAdd: async(userId: Types.ObjectId, productId: Types.ObjectId) =>{
        return await cartModel.findOneAndUpdate({userId}, {$push: {items:{productId, quantity:1}}}, {returnDocument: "after"}).populate("items.productId")
    },
    itemInc: async(userId: Types.ObjectId, productId: Types.ObjectId) =>{
        return await cartModel.findOneAndUpdate({userId, "items.productId": productId}, {$inc: {"items.$.quantity": 1}}, {returnDocument: "after"}).populate("items.productId")
    },
    itemDec: async(userId: Types.ObjectId, productId: Types.ObjectId) =>{
        return await cartModel.findOneAndUpdate({userId, "items.productId": productId}, {$inc: {"items.$.quantity": -1}}, {returnDocument: "after"}).populate("items.productId")
    },
    itemRemove: async(userId: Types.ObjectId, productId: Types.ObjectId) =>{
        return await cartModel.findOneAndUpdate({userId}, {$pull: {items: { productId }}}, {returnDocument: "after"})
    },
    delete: async(userId: Types.ObjectId) =>{
        return await cartModel.findOneAndUpdate({userId}, {$set: {items: []}}, {returnDocument: "after"})
    }
}