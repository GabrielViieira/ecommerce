import { UpdateQuery } from "mongoose";
import { IProd, prodctModel } from "../model/productsModel.ts"



export const prodtRepository = {
    findAll: async (): Promise<IProd[]> => {
        return await prodctModel.find()
    },
    findOneP: async (id: string): Promise<IProd | null> => {
        return await prodctModel.findById(id)
    },
    findQuery: async (query: string): Promise<IProd[] | null> => {
        const result = await prodctModel.find({ title: new RegExp(query, 'i') })
        return result
    },
    create: async (data: Partial<IProd>): Promise<IProd | null> => {
        return await prodctModel.create(data)
    },
    update: async (id: string, data: UpdateQuery<IProd>): Promise<IProd | null> => {
        return await prodctModel.findByIdAndUpdate(
            id,
            { $set: data },
            { returnDocument: "after" }
        )
    },
    delete: async (id: string): Promise<IProd | null> => {
        return await prodctModel.findByIdAndDelete(id)
    },
    feature: async(filters: any) =>{
        return await prodctModel.find(filters)
    }
}