import express from "express"
import UsersRoutes from "./routes/usersRoutes"
import ProdRoutes from "./routes/prodRoutes"
import CartRoutes from "./routes/cartRoutes"
import PayRoutes from "./routes/paymentsRoutes"
import slideRoutes from "./routes/slideRoutes"
import cors from "cors"


export default function createApp(){
    const app = express()
    app.use(express.json())
    app.use(cors())
    app.use(UsersRoutes)
    app.use(ProdRoutes)
    app.use(CartRoutes)
    app.use(PayRoutes)
    app.use(slideRoutes)
    return app
}