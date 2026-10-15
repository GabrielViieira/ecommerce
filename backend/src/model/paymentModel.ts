import mongoose, { Document, Schema, Types } from "mongoose"

export interface IPay extends Document {
    userId: Types.ObjectId,
    username:string,
    items: [{ productId: Types.ObjectId, name: string, quantity: number, priceAtPurchase: number}],
    valorTotal: number
    createdAt: Date,
    updatedAt: Date
    status: string,
    quantity: number
}

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    items: {
        type: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            name: {
                type: String,
                required: true,
                default: ""
            },
            quantity: { type: Number, required: true, default: 1 },
            priceAtPurchase: { type: Number, required: true }
        }],
        default: [],
    },
    valorTotal: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["Pendente", "Pago", "Enviado", "Cancelado"],
        default: "Pendente"
    }
    
},{ timestamps: true })

export const PaymentModel = mongoose.model("payments", PaymentSchema)