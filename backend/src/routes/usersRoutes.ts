import { Router } from "express"
import * as Controller from "../controller/usersController"
import Authorize, {  loginAuth } from "../middlewares/userAuth"


const router = Router()

router.get("/users",loginAuth, Authorize(["admin"]), Controller.getUser)
router.post("/register", Controller.createUser)
router.get("/user/:username", loginAuth, Controller.getUsersbyName)
router.get("/me", loginAuth, Controller.getMe)
router.patch("/user/:id", loginAuth, Controller.updateUser)
router.delete("/user/:id", loginAuth, Controller.deleteUsersbyID)
router.post("/login", Controller.LoginUser)

export default router