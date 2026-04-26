import { Request,Response } from "express";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});
const routeCreate=async (req:Request,res:Response):Promise<any>=>{
   try{
       const {name,description,staffs,genres,lang,duration,dates} = req.body;
       const coverImage=JSON.stringify({
            url:req.file?.path,
            publicId:req.file?.originalname
        });
       const finalData={
        name,
        description,
        producedBy:req.user?._id,
        coverImage,
        staffs,
        genres,
        lang,
        duration,
        dates
        
       }
       console.log(process.env.MovieService_Url,finalData,coverImage);
       const result=await fetch(`${process.env.MovieService_Url}/movie/create`,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
},
     body:new URLSearchParams(finalData as any)
       });
       
       const data=await result.json();
       return res.status(result.status).json(data);
   }
   catch(err){
    console.log(err);
    return res.status(500).json({success:false,mssg:"Internal Sever Error"});
   }
}
const routeUpdate=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {name,description,staffs,genres,lang,duration,dates,movieId} = req.body;
        const finalData={
        name,
        description,
        staffs,
        genres,
        lang,
        duration,
        dates,
        movieId
       }
       const result=await fetch(`${process.env.MovieService_Url}/movie/edit`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
},
     body:new URLSearchParams(finalData as any)
       });
       
       const data=await result.json();
       return res.status(result.status).json(data);
     
    } catch (err) {
    console.log(err);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
        
    }
}
const routeEditCoverImage=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {movieId}=req.body;
       const result=await fetch(`${process.env.MovieService_Url}/movie/editcover`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
},
     body:new URLSearchParams({coverImage:JSON.stringify({
        url:req.file?.path,
        publicId:req.file?.originalname
         }),movieId})
       });
       
       const data=await result.json();
       return res.status(result.status).json(data);

        
    } catch (err) {
    console.log(err);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
    }
}

const routeGetMovies=async (req:Request,res:Response):Promise<any>=>{
 try {
    const result=await fetch(`${process.env.MovieService_Url}/movie/getmovies?get=${req.query.get}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        }
    });
     const data=await result.json()
    return res.status(result.status).json(data);
 } catch (err) {
    console.log(err);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
 }
}
const routeGetMovie=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {id}=req.query;
        const result=await fetch(`${process.env.MovieService_Url}/movie/getmovie?id=${id}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        });
        const data=await result.json();
        return res.status(result.status).json(data);
    } catch (err) {
         console.log(err);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
    }
}
export {routeCreate,routeGetMovies,routeGetMovie,routeUpdate,routeEditCoverImage};
