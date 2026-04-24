import {Router,RequestHandler} from "express";
import { checkSeatAvaiable,removeSeats } from "../controllers/routeSeatBook";
import { authUser } from "../middlewares/auth";
const router=Router();
router.post("/checkseat",authUser as RequestHandler,checkSeatAvaiable);
router.delete("/removeseats",authUser as RequestHandler,removeSeats);
export default router;