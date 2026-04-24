import { checkValidQueryForPayment,paymentSuccessInfo } from "../controllers/payment";
import { Router } from "express";
const router=Router();
router.post("/checkpaymentquery",checkValidQueryForPayment);
router.post("/paymentsuccess",paymentSuccessInfo);
export default router;