import { Router } from "express"
import * as ControllerFav from "../controller/favController.ts"
import { loginAuth } from "../middlewares/userAuth.ts"

const router = Router()

router.get("/favorites", loginAuth, ControllerFav.getFavorites)
router.post("/favorites/toggle", loginAuth, ControllerFav.toggleFavorite)
router.post("/favorites", loginAuth, ControllerFav.addFavorite)
router.delete("/favorites/:productId", loginAuth, ControllerFav.removeFavorite)
router.get("/favorites/check/:productId", loginAuth, ControllerFav.checkFavorite)

export default router