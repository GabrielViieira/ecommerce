import { Request, Response } from "express";
import * as SlideServices from "../services/slideServices";

class ControllerSlide {
    // GET - Usado pela Home (traz apenas ativos) e pelo Dashboard (traz todos)
    async getAll(req: Request, res: Response) {
        try {
            // Se vier o parâmetro ?all=true, traz tudo (útil para o painel admin)
            const showAll = req.query.all === "true";
            const slides = await SlideServices.getSlidesService(!showAll);
            
            return res.status(200).json(slides);
        } catch (error: any) {
            return res.status(500).json({ message: "Erro ao buscar slides", error: error.message });
        }
    }

    // POST - Criar um novo slide/banner no Dashboard
    async create(req: Request, res: Response) {
        try {
            const { imageUrl, linkTo, active } = req.body;
            if (!imageUrl) {
                return res.status(400).json({ message: "A URL da imagem é obrigatória" });
            }

            const slide = await SlideServices.createSlideService({ imageUrl, linkTo, active });
            return res.status(201).json(slide);
        } catch (error: any) {
            return res.status(500).json({ message: "Erro ao criar slide", error: error.message });
        }
    }

    // PUT/PATCH - Alterar imagem, link ou ativar/desativar no Dashboard
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            const updated = await SlideServices.updateSlideService(id, data);
            return res.status(200).json({ message: "Slide atualizado com sucesso", updated });
        } catch (error: any) {
            return res.status(500).json({ message: "Erro ao atualizar slide", error: error.message });
        }
    }

    // DELETE - Remover um slide permanentemente no Dashboard
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await SlideServices.deleteSlideService(id);
            
            return res.status(200).json({ message: "Slide removido com sucesso" });
        } catch (error: any) {
            return res.status(500).json({ message: "Erro ao deletar slide", error: error.message });
        }
    }
}

export default new ControllerSlide();
