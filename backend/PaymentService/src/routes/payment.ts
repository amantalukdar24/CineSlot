import { Router } from "express";
import { createOrder,verifyPayment } from "../controllers/payments";

const router=Router();
router.post("/createorder",createOrder);
router.post("/verifypayment",verifyPayment);

export default router;