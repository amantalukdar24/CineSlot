import { Router,RequestHandler } from "express";
import { registerShow,getShowsTime } from "../controllers/routeShow";
import { authUser } from "../middlewares/auth";
const router=Router();
router.post("/create",authUser as RequestHandler,registerShow);
router.post("/getshowtime",authUser as RequestHandler,getShowsTime);

export default router;