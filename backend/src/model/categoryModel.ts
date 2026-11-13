import mongoose, { Document } from "mongoose"

export interface ICategory extends Document {
  name: string
  description?: string
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
}, { timestamps: true })

export const categoryModel = mongoose.model("Category", categorySchema)