import { createProdService } from "./services/prodServices"
import { getProdService } from "./services/prodServices"
import { deleteProdService } from "./services/prodServices"
import { editProdService } from "./services/prodServices"
import { IProd } from "./model/productsModel"

export const APIservice = {
  getProdService: getProdService,
  createProdService: async (data: Partial<IProd>) => {
    const created = await createProdService(data)
    return created
  },
  deleteProdService: async (id: string) => {
    const result = await deleteProdService(id)
    return result
  },
  editProdService: async (id: string, data: Partial<IProd>) => {
    const updated = await editProdService(id, data)
    return updated
  }
}