import { Request,Response} from "express";
import MOVIE from "../models/movie";
import redis from "../redisConfig";

const createMovie=async (req:Request,res:Response):Promise<any>=>{
   try{
    
    const {name,description,producedBy,staffs,genres,lang,duration,coverImage,dates}=req.body;
    const datesToISO=JSON.parse(dates);
    const movie=await MOVIE.create({
        name,
        description,
        producedBy,
        staffs:JSON.parse(staffs),
        genres,
        lang,
        duration,
        coverImage:JSON.parse(coverImage),
        dates:{
          start:new Date(datesToISO.start),
          end:new Date(datesToISO.end)
        },

    });
    await redis.del("getMovies");
    if(movie) return res.status(201).json({success:true,mssg:"Movie Created"});

     return res.status(400).json({success:false,mssg:"Something Went Wrong"});
     

   }
   catch(err){
    console.log(err);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
   }
}
const editMovie=async (req:Request,res:Response):Promise<any>=>{
  try{
    const {name,description,staffs,genres,lang,duration,movieId,dates}=req.body;
    const datesToISO=JSON.parse(dates);
    const verifyMovie=await MOVIE.findById(movieId);
    if(!verifyMovie) return res.status(404).json({success:false,mssg:"Invalid Valid Movie"});
    const movie=await MOVIE.findByIdAndUpdate(movieId,{
        name,
        description,
        staffs:JSON.parse(staffs),
        genres,
        lang,
        duration,
        dates:{
          start:new Date(datesToISO.start),
          end:new Date(datesToISO.end)
        },

    });
    await redis.del(`movie-${movieId}`)
   return res.status(200).json({success:true,mssg:"Update Successfull"});
  }
  catch(err){
    console.log(err);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
   }
}
const editCoverImage=async (req:Request,res:Response):Promise<any>=>{
  try{
    const {coverImage,movieId}=req.body;
    const verifyMovie=await MOVIE.findById(movieId);
    if(!verifyMovie) return res.status(404).json({success:false,mssg:"Invalid Valid Movie"});
    const movie=await MOVIE.findByIdAndUpdate(movieId,{coverImage:JSON.parse(coverImage)});
    return res.status(200).json({success:true,mssg:"Update Successfull"});
 
  }
  catch(err){
    console.log(err);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
  }
}
const getMovies=async (req:Request,res:Response):Promise<any>=>{
  try {
    const {get}=req.query;
     const today=new Date();
     today.setHours(0,0,0,0);
    if(get==="current"){
    const cacheMovies=await redis.get("getMovies");
    if(cacheMovies) return res.status(200).json({success:true,getMovies:JSON.parse(cacheMovies)});

    const getMovies=await MOVIE.find({"dates.end":{$gte:today}}).sort({"dates.start":1});
    await redis.set("getMovies",JSON.stringify(getMovies),'EX',900)
 if(getMovies.length>0) return res.status(200).json({success:true,getMovies});
    }
 else if(get==="complete"){
   const getMovies=await MOVIE.find({"dates.end":{$lte:today}}).sort({"dates.start":1});
 if(getMovies.length>0) return res.status(200).json({success:true,getMovies});
 }
 return res.status(404).json({success:false,mssg:"No movies Found"})
  } catch (err) {
    console.log(err)
    return res.status(500).json({success:false,mssg:"Internal Server Down"})
  }
}

const getMovie=async (req:Request,res:Response):Promise<any>=>{
  try {
    const {id}=req.query;
    if(!id) return res.status(404).json({success:false,mssg:"No Movies Found"});
    const cacheMovie=await redis.get(`movie-${id}`);
    if(cacheMovie) return res.status(200).json({success:true,movie:JSON.parse(cacheMovie)});
    const movie=await MOVIE.findById(id);
    if(movie){
       await redis.set(`movie-${id}`,JSON.stringify(movie),"EX",900);
       return res.status(200).json({success:true,movie});
    }
    else return res.status(404).json({success:false,mssg:"No Movies Found"});
    
  } catch (err) {
      console.log(err)
      return res.status(500).json({success:false,mssg:"Internal Server Down"})
  }
}
export {createMovie,
getMovies,getMovie,editMovie,editCoverImage
};