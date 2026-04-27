import {Request,Response} from "express";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import dotenv from "dotenv";
dotenv.config();

const getBookings=async (req:Request,res:Response):Promise<any>=>{
   try {
       const {skip}=req.query;
       const result=await fetchWithRetry(`${process.env.MovieService_Url}/bookings/userbooking?skip=${skip}&userId=${req.user?._id}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        },

       });
       const data=await result.json();
       return res.status(result.status).json(data);
   } catch (err) {
     console.log(`${err}`);
     return res.status(500).json({success:false,mssg:"Internal Server Down"});
   }
}
const getBookDetailsForShow=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {movieId,forDate,time}=req.query;
        const result=await fetchWithRetry(`${process.env.MovieService_Url}/bookings/showbookings?movieId=${movieId}&forDate=${forDate}&time=${time}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        });
        const data=await result.json();
        return res.status(result.status).json(data);
    } catch (err) {
    console.log(`${err}`);
     return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}
const cancelBookings=async (req:Request,res:Response):Promise<any>=>{
    try{
       const {paymentDetails}=req.body;
       const result=await fetchWithRetry(`${process.env.MovieService_Url}/bookings/cancelbooking`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:new URLSearchParams({paymentDetails,userId:req.user?._id})
       });
       const data=await result.json();
       return res.status(result.status).json(data);
    }
    catch(err){
         console.log(`${err}`);
     return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}
export {getBookings,getBookDetailsForShow,cancelBookings};