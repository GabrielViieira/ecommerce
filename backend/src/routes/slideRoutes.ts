import { Router } from "express";
import ControllerSlide from "../controller/slideController";
import Authorize, { loginAuth } from "../middlewares/userAuth";

const router = Router();

// Rota pública para a Home carregar os banners ativos
router.get("/slides", ControllerSlide.getAll);

// Rotas protegidas para o gerenciamento do Dashboard Admin/Seller
router.post("/slides", loginAuth, Authorize(["admin"]), ControllerSlide.create);
router.put("/slides/:id", loginAuth, Authorize(["admin"]), ControllerSlide.update);
router.delete("/slides/:id", loginAuth, Authorize(["admin"]), ControllerSlide.delete);

export default router;
