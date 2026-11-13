import { ICategory } from "../model/categoryModel"
import { catRepository } from "../repositories/catData"

export const findAll = async (): Promise<ICategory[]> => {
    return await catRepository.findAll()
  }

export const findByName = async (name: string): Promise<ICategory | null> => {
    return await catRepository.findByName(name)
  }

export const create = async (data: { name: string; description?: string }): Promise<ICategory> => {
    return await catRepository.create(data)
  }

export const findOrCreate = async (name: string, description?: string): Promise<ICategory> => {
    return await catRepository.findOrCreate(name, description)
  }