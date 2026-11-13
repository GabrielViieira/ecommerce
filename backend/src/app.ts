import express from "express"
import UsersRoutes from "./routes/usersRoutes"
import ProdRoutes from "./routes/prodRoutes"
import CartRoutes from "./routes/cartRoutes"
import PayRoutes from "./routes/paymentsRoutes"
import slideRoutes from "./routes/slideRoutes"
import CategoryRoutes from "./routes/catRoutes"
import FavRoutes from "./routes/favRoutes"
import cors from "cors"


export default function createApp() {
    const app = express()
    app.use(express.json())
    app.use(cors())
    app.use(UsersRoutes)
    app.use(ProdRoutes)
    app.use(CartRoutes)
    app.use(PayRoutes)
    app.use(slideRoutes)
    app.use(CategoryRoutes)
    app.use(FavRoutes)
    return app
}