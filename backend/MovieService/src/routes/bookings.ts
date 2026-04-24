import {Router} from "express";
import { getUserBookings,getBookDetailsForShow,cancelBookings } from "../controllers/bookings";

const router=Router();
router.get("/userbooking",getUserBookings);
router.get("/showbookings",getBookDetailsForShow);
router.patch("/cancelbooking",cancelBookings);
export default router;
