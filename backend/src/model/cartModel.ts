import mongoose, { Document, Schema, Types } from "mongoose"

export interface ICart extends Document {
    userId: Types.ObjectId,
    items: [{ productId: Types.ObjectId, quantity: number, image: string }]
}

const cartSchema = new mongoose.Schema<ICart>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "Users"
    },
    items: {
        type: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            image: {type: String, default: ""}
        }],
        default: [],
    }
})

export const cartModel = mongoose.model("Cart", cartSchema)