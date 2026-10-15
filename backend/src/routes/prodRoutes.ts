import { Router } from "express"
import * as ControllerProd from "../controller/prodController.ts"
import Authorize, { loginAuth } from "../middlewares/userAuth.ts"


const router = Router()

router.get("/lista/prod",loginAuth, ControllerProd.getProd)
router.get("/prod",loginAuth, ControllerProd.getQueryProd)
router.get("/lista/prod/:id",loginAuth, ControllerProd.getProdByID)
router.post("/prod",loginAuth,Authorize(["admin","seller"]), ControllerProd.createProd)
router.put("/lista/prod/:id",loginAuth,Authorize(["admin","seller"]), ControllerProd.updateProd)
router.delete("/lista/prod/:id",loginAuth,Authorize(["admin","seller"]), ControllerProd.deleteProd)
router.get("/prod/feature", loginAuth, ControllerProd.featuredProd)
router.get("/prod/on-sale", loginAuth, ControllerProd.promoProd)

export default router