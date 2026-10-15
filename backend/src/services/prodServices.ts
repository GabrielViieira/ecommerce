import { UpdateQuery } from "mongoose";
import { IProd } from "../model/productsModel"
import { prodtRepository } from "../repositories/prodtData"



export const getProdService = async () => {
    const data = await prodtRepository.findAll()

    return data
}

export const getProdIdService = async (id: string) => {
    const data = await prodtRepository.findOneP(id)

    return data
}

export const getQueryProdService = async (query: string) => {
    const data = await prodtRepository.findQuery(query)
    if (!data) throw new Error("Não foi possivel achar o produto!")
    return data
}

export const createProdService = async (data: Partial<IProd>) => {
    const created = await prodtRepository.create(data)
    return created
}

export const updateProdService = async (id: string, data: UpdateQuery<IProd>) => {
    
    if (data && typeof data === 'object') {
        delete (data as any)._id
    }

    const prod = await prodtRepository.update(id, data)
    
    if (!prod) throw new Error("Produto não encontrado")
    return prod
}

export const deleteProdService = async (id: string) => {
    await prodtRepository.delete(id)

    return id
}

export const featuredProdService = async () =>{
    const data = await prodtRepository.feature({ isFeatured: true })
    return data.slice(0, 10)
}

export const promoProdService = async () =>{
 return await prodtRepository.feature({discount: {$gt: 0}})   
}