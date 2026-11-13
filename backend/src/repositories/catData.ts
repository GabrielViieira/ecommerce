import { ICategory, categoryModel } from "../model/categoryModel"

export const catRepository = {
  findAll: async (): Promise<ICategory[]> => {
    return await categoryModel.find()
  },
  findByName: async (name: string): Promise<ICategory | null> => {
    return await categoryModel.findOne({ name })
  },
  create: async (data: { name: string; description?: string }): Promise<ICategory> => {
    return await categoryModel.create(data)
  },
  findOrCreate: async (name: string, description?: string): Promise<ICategory> => {
    let category = await categoryModel.findOne({ name })
    if (!category) {
      category = await categoryModel.create({ name, description })
    }
    return category
  }
}