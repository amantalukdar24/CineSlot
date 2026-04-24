import { Router } from "express";
import { getBookings,getBookDetailsForShow,cancelBookings } from "../controllers/routeBooking";
import { authUser } from "../middlewares/auth";
const router=Router();
router.get("/userbooking",authUser,getBookings);
router.get("/showbookings",authUser,getBookDetailsForShow);
router.patch("/cancelbooking",authUser,cancelBookings);
export default router;