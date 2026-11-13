import { Router } from "express"
import {
  getCats,
  getCatByName,
  createCat,
  findOrCreateCat,
} from "../controller/catController"

const routes = Router()

routes.get("/categories", getCats)
routes.get("/categories/:name", getCatByName)
routes.post("/categories", createCat)
routes.post("/categories/find-or-create", findOrCreateCat)

export default routes