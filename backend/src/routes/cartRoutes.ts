import { Router } from "express"
import * as ControllerCart from "../controller/cartController.ts"
import { loginAuth } from "../middlewares/userAuth.ts"


const router = Router()

router.get("/cart",loginAuth, ControllerCart.getCart)
router.get("/cart/:id",loginAuth, ControllerCart.getCart)
router.post("/cart/add",loginAuth, ControllerCart.addItem)
router.patch("/cart/dec",loginAuth, ControllerCart.removeItem)
router.delete("/cart/clean",loginAuth, ControllerCart.cleanCart)


export default router