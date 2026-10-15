import { Request, Response } from "express"
import * as ProdServices from "../services/prodServices.ts"

type Params = {
    id: string
}


export const getProd = async (req: Request, res: Response) => {
    try {
        const prods = await ProdServices.getProdService()
        res.status(200).json(prods)
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao achar produto",
            error: err?.message ?? String(err),
        })
    }
}

export const getProdByID = async (req: Request<Params>, res: Response) => {
    try {
        const id = req.params.id
        const prods = await ProdServices.getProdIdService(id)
        res.json(prods)
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao achar id do produto",
            error: err?.message ?? String(err),
        })
    }
}

export const getQueryProd = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const prod = await ProdServices.getQueryProdService(String(search))
        res.status(200).json(prod)
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao encontrar produto",
            error: err?.message ?? String(err),
        })
    }
}

export const createProd = async (req: Request, res: Response) => {
    try {
        const prod = await ProdServices.createProdService(req.body)
        return res.status(201).json(prod)
    } catch (err: any) {
        console.error(err)
        return res.status(400).json({
            message: "Erro ao criar produto",
            error: err?.message ?? String(err),
        })
    }
}

export const deleteProd = async (req: Request<Params>, res: Response) => {
    try {
        const id = req.params.id
        const prod = await ProdServices.deleteProdService(id)
        res.json({ prod, message: "Item deletado" })
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao deletar produto",
            error: err?.message ?? String(err),
        })
    }
}

export const updateProd = async (req: Request<Params>, res: Response) => {
    try {
        const id = req.params.id
        const data = req.body
        const prod = await ProdServices.updateProdService(id, data)

        res.status(200).json({ prod, message: "Item atualizado" })
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao atualizar produto",
            error: err?.message ?? String(err),
        })
    }
}

export const featuredProd = async (req: Request<Params>, res: Response) => {
    try {
        const prod = await ProdServices.featuredProdService()

        res.status(200).json(prod)
    } catch (err: any) {
        return res.status(500).json({
            message: "Erro ao achar produtos em destaque",
            error: err?.message ?? String(err),
        })
    }
}

export const promoProd = async (req: Request<Params>, res: Response) => {
    try {
        const prod = await ProdServices.promoProdService()

        res.status(200).json(prod)
    } catch (err: any) {
        return res.status(404).json({
            message: "Erro ao ver promoções",
            error: err?.message ?? String(err),
        })
    }
}