import { Request, Response } from "express"
import * as CatServices from "../services/catServices"

export const getCats = async (req: Request, res: Response) => {
  try {
    const cats = await CatServices.findAll()
    res.status(200).json(cats)
  } catch (err: any) {
    return res.status(400).json({
      message: "Erro ao achar categorias",
      error: err?.message ?? String(err),
    })
  }
}

export const getCatByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    const cat = await CatServices.findByName(name as string)
    if (!cat) return res.status(404).json({ message: "Categoria não encontrada" })
    res.status(200).json(cat)
  } catch (err: any) {
    return res.status(400).json({
      message: "Erro ao achar categoria por nome",
      error: err?.message ?? String(err),
    })
  }
}

export const createCat = async (req: Request, res: Response) => {
  try {
    const cat = await CatServices.create(req.body)
    return res.status(201).json(cat)
  } catch (err: any) {
    return res.status(400).json({
      message: "Erro ao criar categoria",
      error: err?.message ?? String(err),
    })
  }
}

export const findOrCreateCat = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body
    const cat = await CatServices.findOrCreate(name, description)
    return res.status(200).json(cat)
  } catch (err: any) {
    return res.status(400).json({
      message: "Erro ao encontrar ou criar categoria",
      error: err?.message ?? String(err),
    })
  }
}