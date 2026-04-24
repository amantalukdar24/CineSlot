import {Router} from "express";
import { registerShowTime,getShowsTime,getShowsTimeClient } from "../controllers/show";
const router=Router();

router.post("/create",registerShowTime);
router.post("/getshowtime",getShowsTime);
router.get("/getshowtimeclient",getShowsTimeClient);

export default router;
