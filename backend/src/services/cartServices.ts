import { Types } from "mongoose"
import {cartRepository} from "../repositories/cartData.ts"


export const getCartService = async(userId: Types.ObjectId) =>{
    let cart = await cartRepository.findCartByUser(userId)
    
    if (!cart) return await cartRepository.create(userId)

    return await cartRepository.findCartByUser(userId)
}

export const addItemService = async(userId: Types.ObjectId, productId: Types.ObjectId) =>{
    let cart = await cartRepository.findCartByUser(userId)
    if (!cart) {
        cart = await cartRepository.create(userId)
    }
    const itemExists = cart.items.find((item) => {
    if (!item.productId) return false;
    
    const idNoItem = item.productId && item.productId._id ? item.productId._id.toString() : item.productId.toString();
    return idNoItem === productId.toString();
})

    if (itemExists) {
        return await cartRepository.itemInc(userId, productId)
    }else{
        return await cartRepository.itemAdd(userId, productId)
    }

    
}

export const decItemsService = async(userId: Types.ObjectId, productId: Types.ObjectId) =>{
    const cart = await cartRepository.findCartByUser(userId)
    if (cart == null) throw new Error("Carrinho não encontrado")

    const itemExists = cart.items.find((item) => {
        const idNoBanco = item.productId._id 
            ? item.productId._id.toString() 
            : item.productId.toString();
            
        return idNoBanco === productId.toString();
    })
    if (!itemExists) throw new Error("Item não encontrado")

    if (itemExists.quantity > 1) {
        return await cartRepository.itemDec(userId, productId)
    }
    return await cartRepository.itemRemove(userId, productId)
}

export const clearCartService = async (userId: Types.ObjectId) => {

  const cart = await cartRepository.findCartByUser(userId)
  if (!cart) throw new Error("Carrinho não encontrado")

  return await cartRepository.delete(userId)
}