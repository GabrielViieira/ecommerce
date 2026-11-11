import mongoose from "mongoose"

export const connectDB = async() => {
   await mongoose.connect("mongodb://localhost:27017/ecommerce")
      .then(() => console.log("Conectado ao MongoDB"))
      .catch((err) => console.error(err))
}
