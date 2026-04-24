import {RequestHandler, Router} from "express";
import {config as dotenv} from "dotenv";
import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import { authUser } from "../middlewares/auth";
import { routeCreate,routeGetMovies,routeGetMovie,routeUpdate,routeEditCoverImage } from "../controllers/routeMovie";
const router=Router();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});
const storage=new CloudinaryStorage({
  cloudinary,
  params:async (req,file)=>{
  
   
     const folder="CineSlot/Movie";
     const ext = file.originalname.split('.').pop();
    const filtername=file.originalname.replace(/\.[^/.]+$/, "")        
    .replace(/[^\w\s-]/g, "")      
    .trim()
    .replace(/\s+/g, "_")            
    + "." + ext;
    const fileName=`${req.body.name}-${Date.now()}-${filtername}`;
      
      return {
        folder,
 resource_type: "image",
      public_id: fileName, 
      };
  }
})
const upload = multer({ storage: storage });
router.post("/create",authUser as RequestHandler,upload.single("coverImage"),routeCreate);
router.get("/getmovies",authUser as RequestHandler,routeGetMovies);
router.get("/getmovie",authUser as RequestHandler,routeGetMovie);
router.patch("/edit",authUser,routeUpdate);
router.patch("/editcover",authUser,upload.single("coverImage"),routeEditCoverImage);
export default router;