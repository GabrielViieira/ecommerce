import { Router } from "express"
import * as ControllerPay from "../controller/paymentController.ts"
import { loginAuth } from "../middlewares/userAuth.ts"
import { ro } from "date-fns/locale";


const router = Router()

router.get("/history", loginAuth, ControllerPay.getPaymentsbyUser)
router.get("/payments/stats/monthly", loginAuth, ControllerPay.monthlyPayments) 
router.post("/payments/checkout", loginAuth, ControllerPay.addPayments)   
router.get("/best-selling", loginAuth, ControllerPay.BestSelling)
router.get("/payments", loginAuth, ControllerPay.getPayments)

router.get("/payments/:id", loginAuth, ControllerPay.getPaymentsbyID)       
router.patch("/payments/:id/status", loginAuth, ControllerPay.updatePayments)    

export default router