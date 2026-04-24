import {Router} from "express";
import { createMovie,getMovies,getMovie,editMovie,editCoverImage } from "../controllers/movie";
const router=Router();
router.post("/create",createMovie);
router.get("/getmovies",getMovies);
router.get("/getmovie",getMovie);
router.patch("/edit",editMovie);
router.patch("/editcover",editCoverImage);

export default router;