import mongoose, { Document, Schema, Types } from "mongoose"

export interface IFav extends Document {
    userId: Types.ObjectId,
    items: Types.ObjectId[]
}

const favSchema = new mongoose.Schema<IFav>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "Users"
    },
    items: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Product"
        }],
        default: [],
        validate: {
            validator: function(v: Types.ObjectId[]) {
                return v.length <= 250
            },
            message: "Limite de 250 favoritos excedido"
        }
    }
})

export const favModel = mongoose.model("Favorite", favSchema)