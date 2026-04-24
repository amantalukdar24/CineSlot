import {Router} from "express";
import {registerAdmin,loginAdmin,getOtp,getAccountDetails} from "../controllers/admin";
import { emailValidator } from "../middlewares/emailValidation";
import { authUser } from "../middlewares/auth";
const router=Router();

router.post("/signup",emailValidator,registerAdmin);
router.post("/signin",emailValidator,loginAdmin);
router.post("/getotp",emailValidator,getOtp);
router.get("/getaccount",authUser,getAccountDetails);

export default router;