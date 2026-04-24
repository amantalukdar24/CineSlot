import { Router } from "express";
import { createOrder,verifyPayment,checkValidQueryForPayment,paymentSuccessInfo } from "../controllers/routePayment";
import { authUser } from "../middlewares/auth";
const router=Router();
router.post("/createorder",authUser,createOrder);
router.post("/verifypayment",authUser,verifyPayment);
router.post("/checkpaymentquery",authUser,checkValidQueryForPayment);
router.post("/paymentsuccess",authUser,paymentSuccessInfo);
export default router;