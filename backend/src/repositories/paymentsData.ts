import { IPay, PaymentModel } from "../model/paymentModel";
import { CartItem, PayQuery } from "../types/paymentTypes";


export const PaymentRepository = {
    findall:async(query: PayQuery) =>{
        return await PaymentModel.find(query).populate("userId", "username")
        .sort({ createdAt: -1 })
    },
    findByUser:async(userId: string) =>{
        return await PaymentModel.find({ userId: userId }).sort({ createdAt: -1 }).populate("userId", "username")
    },
    findByID:async(userId: string) =>{
        return await PaymentModel.find({userId}).populate("items.productId")
    },
    add:async(userId: string, items: CartItem[], valorTotal: number) =>{
        const novoPagamento = await PaymentModel.create({
        userId,
        valorTotal,
        status: "Pendente"
    })
    return await novoPagamento.populate("items.productId")
    },
    update:async(id: string, data: Partial<IPay>) =>{
        return await PaymentModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true })
    },
    delete:async(id: string) =>{
        return await PaymentModel.findByIdAndDelete(id)
    },
    monthly: async() =>{
        return await PaymentModel.aggregate([
    {
      $group: {
            _id: { $month: "$createdAt" }, 
            vendas: { $sum: "$valorTotal" }, 
            quantidade: { $sum: 1 } 
        }
         },
        { $sort: { "_id": 1 } }
    ])
    },
    bestselling: async() =>{
        return await PaymentModel.aggregate([
    { $unwind: "$items" },
    { $group: { 
        _id: "$items.productId",
        title: { $first: "$items.name" },
        quantity: { $sum: "$items.quantity" }
    }},
    {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "produtoInfo"
            }
        },
        { $unwind: "$produtoInfo" },
        {
            $project: {
                _id: 1,
                title: "$produtoInfo.title",
                quantity: 1,
                isFeatured: "$produtoInfo.isFeatured"
            }
        },
    { $sort: { quantity: -1 } },
    { $limit: 10 }
    ])
    },
    totalsellings: async() => {await PaymentModel.countDocuments()}
}