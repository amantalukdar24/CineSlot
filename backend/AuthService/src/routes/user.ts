import {Router} from "express";
import {registerUser,getOtp,loginUser,getUser,getAccountDetails} from "../controllers/user"
import { authUser } from "../middlewares/auth";
import { emailValidator } from "../middlewares/emailValidation";
const router=Router();

router.post("/signup",emailValidator,registerUser);
router.post("/getotp",emailValidator,getOtp);
router.post("/signin",emailValidator,loginUser);
router.get("/getuser",authUser,getUser);
router.get("/getaccount",authUser,getAccountDetails);
export default router;