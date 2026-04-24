import {Request,Response} from "express";
import dotenv from "dotenv";
dotenv.config();
const registerShow=async (req:Request,res:Response):Promise<any>=>{
try {
     
    const result=await fetch(`${process.env.MovieService_Url}/show/create`,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
        },
        body:new URLSearchParams(req.body)
    });
    const data=await result.json();
    return res.status(result.status).json(data);
    
} catch (err) {
    console.log(`${err}`);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
}
}
const getShowsTime=async (req:Request,res:Response):Promise<any>=>{
 try {
    
    const {movieId}=req.body;
    const result=await fetch(`${process.env.MovieService_Url}/show/getshowtime`,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
        },
        body:new URLSearchParams({movieId})
    });
    const data=await result.json();
    return res.status(result.status).json(data);   
 } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
 }
}
export {registerShow,getShowsTime};