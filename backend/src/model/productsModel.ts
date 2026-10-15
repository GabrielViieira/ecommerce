import mongoose, { Document } from "mongoose"

export interface IProd extends Document {
  title: string,
  desc?: string,
  quantity: number,
  image?: string,
  price: number,
  isFeatured: boolean,
  discount:number
}

const prodcSchema = new mongoose.Schema<IProd>({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: [true, "Nome do produto já está sendo utilizado"]
  },
  desc: {
    type: String,
    trim: true,
    required: false,
    default: " "
  },
  quantity: {
    type: Number,
    required: true,
    default:0
  },
  image: {
    type: String,
    required: false,
    default: " "
  },
  price:{
    type: Number,
    required: true
  },
  isFeatured: { type: Boolean, default: false },
  discount: { type: Number, default: 0 }
  
},{ collection: 'products' })

export const prodctModel = mongoose.model("Product", prodcSchema)
