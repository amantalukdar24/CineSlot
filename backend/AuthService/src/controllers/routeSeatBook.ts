import {Request,Response} from "express";
import dotenv from "dotenv";
dotenv.config();
const checkSeatAvaiable=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {forDate,movieId,time,seats}=req.body;
        const userId=req.user?._id;
        const result=await fetch(`${process.env.MovieService_Url}/seatbook/checkseat`,{
            method:"POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body:new URLSearchParams({forDate,movieId,time,seats,userId})
        });
        const data=await result.json();
        return res.status(result.status).json(data);
        
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Error"});
    }
}

const removeSeats=async (req:Request,res:Response):Promise<any>=>{
    try { 
        const {forDate,movieId,time,seats}=req.body;
        const userId=req.user?._id;
        const result=await fetch(`${process.env.MovieService_Url}/seatbook/removeseats`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body:new URLSearchParams({forDate,movieId,time,seats,userId})
        });
        const data=await result.json();
        return res.status(result.status).json(data);
        
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Error"});
    }
}
export {checkSeatAvaiable,removeSeats};