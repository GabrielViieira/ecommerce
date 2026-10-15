import { PaymentRepository } from "../repositories/paymentsData";
import { PayQuery } from "../types/paymentTypes";
import { IPay, PaymentModel } from "../model/paymentModel";
import { prodctModel } from "../model/productsModel";


export const getPaymentsService = async(query: PayQuery) =>{
    return await PaymentRepository.findall(query)

}

export const getPaymentsbyUserService = async(userId: string) =>{
    return await PaymentRepository.findByUser(userId)

}

export const getPaymentsbyIDService = async(id: string): Promise<any[]> =>{
    return await PaymentRepository.findByID(id)
}

export const createPaymentService = async (userId: string, items: any[]) => {
    let valorTotalCalculado = 0
    const itemsProcessados = []

     for (const item of items) {
        const produtoBanco = await prodctModel.findById(item.productId);

        if (!produtoBanco) {
            throw new Error(`Produto com ID ${item.productId} não foi encontrado.`);
        }

        const subtotalItem = produtoBanco.price * item.quantity;
        valorTotalCalculado += subtotalItem;

        itemsProcessados.push({
            productId: produtoBanco._id,
            name: produtoBanco.title,
            quantity: item.quantity,
            priceAtPurchase: produtoBanco.price
        });
    }
    const novoPagamento = new PaymentModel({
        userId,
        items: itemsProcessados,
        valorTotal: valorTotalCalculado,
        quantity: Number,
        status: "Pago"
    })

    await novoPagamento.save()
    return await novoPagamento.populate("items.productId") 
}


export const updatePaymentsService = async(id: string, data:Partial<IPay>) =>{
    delete data._id
    const prod = await PaymentRepository.update(id, data)
    if(!prod) throw new Error("Nao foi possivel localizar o item")
    return prod
}

export const deletePaymentsService = async(id: string) =>{
    return await PaymentRepository.delete(id)
}

export const monthlyPayService = async() =>{
    return await PaymentRepository.monthly()
}

export const bestSellingService = async() =>{
    return await PaymentRepository.bestselling()
}

export const totalSellingService = async() =>{
    return await PaymentRepository.totalsellings()
}
