import { Router } from "express";
import { getBookedSeats,createSeats,checkSeatAvaiable,getTemporaryBookSeats,removeSeats } from "../controllers/seatBooking";
const router=Router();

router.post("/getbookedseats",getBookedSeats);

router.post("/create",createSeats);
router.post("/checkseat",checkSeatAvaiable);
router.post("/gettempbookedseat",getTemporaryBookSeats)
router.delete("/removeseats",removeSeats);

export default router;

