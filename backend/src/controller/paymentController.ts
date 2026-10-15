import { Request, Response } from "express"
import * as PaymentServices from "../services/paymentServices"
import { clearCartService } from "../services/cartServices";
import * as ProdServices from "../services/prodServices.ts"

export const getPayments = async(req: Request, res: Response) =>{

    try {
        const payments = await PaymentServices.getPaymentsService(req.body)
        res.status(200).json(payments)
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao achar pagamento",
            error: err?.message ?? String(err),
        })
    }
}

export const getPaymentsbyUser = async(req: Request, res: Response) =>{
    try {
        const payID = (req as any).user._id
        const payment = await PaymentServices.getPaymentsbyUserService(payID)
        if (!payment || payment.length === 0) {
        return res.status(200).json([])
    }
        res.status(200).json(payment)
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao achar recibo",
            error: err?.message ?? String(err),
        })
    }
}

export const getPaymentsbyID = async(req: Request, res: Response) =>{
    try {
        const {id} = req.params
        if (!id) {
            return res.status(400).json({ message: "ID não fornecido" });
        }
        const payments = await PaymentServices.getPaymentsbyIDService(String(id))
        if (!payments ) {
            return res.status(404).json({ message: "Pagamento não encontrado" });
        }
        res.status(200).json(payments)
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao achar pagamento do usuário",
            error: err?.message ?? String(err),
        })
    }
}

export const addPayments = async (req: Request, res: Response) => {
    const esperarMilisegundos = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
        const userId = (req as any).user._id;
        const { items } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "O carrinho está vazio" });
        }

        await esperarMilisegundos(3000);

        const produtosProcessados = [];

        for (const item of items) {
            
            const produto = await ProdServices.getProdIdService(item.productId);

            if (!produto) {
                return res.status(404).json({ message: `Produto com ID ${item.productId} não encontrado.` });
            }

            if (produto.quantity < item.quantity) {
                return res.status(400).json({ 
                    message: `Estoque insuficiente para o produto: ${produto.title}` 
                });
            }

            const novoEstoque = produto.quantity - item.quantity;

           
            await ProdServices.updateProdService(item.productId, {
                quantity: novoEstoque
            });

            
            produtosProcessados.push(produto);
        } 
        let valorTotalPedido = 0;
        for (const item of items) {
            const produto = await ProdServices.getProdIdService(item.productId);
            if (produto) {
                valorTotalPedido += (produto.price * item.quantity);
            }
        }
        const payment = await PaymentServices.createPaymentService(
    userId, 
    items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity
    }))
)
        await clearCartService(userId);

        return res.status(201).json({
            success: true,
            message: "Pagamento realizado com sucesso",
            data: produtosProcessados
        });

    } catch (err: any) {
        console.error("Erro interno no controller de pagamentos:", err);
        return res.status(500).json({
            message: "Erro ao processar pagamento",
            error: err?.message ?? String(err),
        });
    }
}

export const updatePayments = async(req: Request, res: Response) =>{
    try {
        const {id} = req.params
        const data = req.body

        const prods = await PaymentServices.updatePaymentsService(String(id), data)
        if (!prods) {
            return res.status(404).json({ message: "Pagamento não encontrado" });
        }
        res.status(200).json(prods)
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao atualizar pagamento",
            error: err?.message ?? String(err),
        })
    }
}

export const deletePayments = async(req: Request, res: Response) =>{
    try {
        const {id} = req.params
        if(!id) {
            return res.status(404).json({ message: "Pagamento não encontrado" });
        }
        const prods = await PaymentServices.deletePaymentsService(String(id))
        res.status(200).json(prods)
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao deletar pagamento",
            error: err?.message ?? String(err),
        })
    }
}

export const monthlyPayments = async(req: Request, res: Response) =>{
    try {
        const stats = await PaymentServices.monthlyPayService()
        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const formattedData = stats.map((item: any) => ({
            month: meses[item._id - 1] || `Mês ${item._id}`, 
            valorVendas: item.vendas,
            pedidos: item.quantidade
        }))
        res.status(200).json(formattedData)
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao achar os valores por mes",
            error: err?.message ?? String(err),
        })
    }
}

export const BestSelling = async(req: Request, res: Response) =>{
    try {
        const selling = await PaymentServices.bestSellingService()
        
        const formattedData = selling.map((items: any) => ({
            _id: items._id,
            title: items.title,
            quantity: items.totalVendas || items.quantity,
            isFeatured: items.isFeatured || false
        }))
        res.status(200).json(formattedData)
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao achar maiores vendas",
            error: err?.message ?? String(err),
        })
    }
}

export const totalValue = async(req: Request, res: Response) =>{
    try {
        const value = await PaymentServices.totalSellingService()
        res.status(200).json(value)
    } catch (err: any) {
        return res.status(400).json({
            message: "Erro ao achar valor total",
            error: err?.message ?? String(err),
        })
    }
}

