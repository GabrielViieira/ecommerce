import { Router } from "express"
import * as ControllerProd from "../controller/prodController.ts"
import Authorize, { loginAuth } from "../middlewares/userAuth.ts"


const router = Router()

// Public endpoints - no authentication required for guests
router.get("/lista/prod", ControllerProd.getProd)
router.get("/prod", ControllerProd.getQueryProd)
router.get("/lista/prod/:id", ControllerProd.getProdByID)
router.get("/prod/feature", ControllerProd.featuredProd)
router.get("/prod/on-sale", ControllerProd.promoProd)

// Protected endpoints - require authentication and admin/seller role
router.post("/prod", loginAuth, Authorize(["admin","seller"]), ControllerProd.createProd)
router.put("/lista/prod/:id", loginAuth, Authorize(["admin","seller"]), ControllerProd.updateProd)
router.delete("/lista/prod/:id", loginAuth, Authorize(["admin","seller"]), ControllerProd.deleteProd)

export default router