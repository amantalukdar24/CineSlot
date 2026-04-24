import {Request,Response} from "express";
import seatBooking from "../models/seatBooking";
import { Types } from "mongoose";
import redis from "../redisConfig";
const getUserBookings=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {skip,userId}=req.query;
        let allBookings;
        const cacheBookings=await redis.hget(`bookings-${userId}`,`${skip}`);
       if(cacheBookings)   allBookings=JSON.parse(cacheBookings);
        if(!cacheBookings){
        allBookings=await seatBooking.aggregate([{$match:{bookedUser:new Types.ObjectId(userId as string)}},{
            $group:{
                _id:{order_id:"$order_id",payment_id:"$payment_id"},
                 seats:{$push:"$seatNo"},
                amountPaid:{$sum:"$fare"},
                doc:{$first:"$$ROOT"},
            }
        },{$addFields:{"doc._id":"$_id","doc.seats":"$seats","doc.amountPaid":"$amountPaid"}},{
            $replaceRoot:{newRoot:"$doc"}
        },{$project:{seatNo:0,bookedUser:0,fare:0,seatType:0,order_id:0,payment_id:0,__v:0,updatedAt:0}},{
            $lookup:{
                from:"showtimes",
                localField:"forDate",
                foreignField:"_id",
                as:"dates"
            }
        },{$unwind:"$dates"},{$project:{"dates._id":0,"dates.times":0,"dates.movieId":0,"dates.createdAt":0,"dates.updatedAt":0,"dates.__v":0}},{
            $lookup:{
                from:"movies",
                localField:"movieId",
                foreignField:"_id",
                as:"movie"
            }
        },{$unwind:"$movie"},
        {$project:{"movie.description":0,"movie.producedBy":0,"movie.director":0,"movie.dates":0,"movie.staffs":0,"movie.coverImage.publicId":0,"movie.createdAt":0,"movie.updatedAt":0,"movie.__v":0,}},
        {$project:{forDate:0,movieId:0}},
        {$sort:{createdAt:-1}},
    {$skip:Number(skip)},
    {$limit:5},
     ]);
     await redis.hset(`bookings-${userId}`,{[`${skip}`] : JSON.stringify(allBookings)});
     await redis.expire(`bookings-${userId}`, 180);
    }
    const totalCounts=await seatBooking.aggregate([{$match:{bookedUser:new Types.ObjectId(userId as string)}},{
        $group:{
            _id:{order_id:"$order_id",payment_id:"$payment_id"}
        }
    }]);
    return res.status(200).json({success:true,allBookings,totalBookings:totalCounts.length});
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Error"});
    }
}
const getBookDetailsForShow=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {movieId,forDate,time}=req.query;
        if(!movieId || !time || !forDate ) return res.status(400).json({success:false,mssg:"Invalid Request"});
        const  details=await seatBooking.aggregate([{$match:{movieId:new Types.ObjectId(movieId as string),forDate:new Types.ObjectId(forDate as string),time:time}},{
           $lookup:{
            from:"showtimes",
            localField:"forDate",
            foreignField:"_id",
            as:"dates"
           }
        },{$unwind:"$dates"},{
            $project:{"dates.moveId":0,"dates.times":0,"dates.createdAt":0,"dates.updatedAt":0,"dates.__v":0,forDate:0}
        },{
            $lookup:{
                from:"movies",localField:"movieId",foreignField:"_id",as:"movie"
            }
        },{
            $unwind:"$movie"
        }, {$project:{"movie.description":0,"movie.producedBy":0,"movie.director":0,"movie.dates":0,"movie.staffs":0,"movie.createdAt":0,"movie.updatedAt":0,"movie.__v":0,"movie.coverImage":0,movieId:0,__v:0,updatedAt:0}},
        {$sort:{createdAt:1}},
        
    ]);
    const totalBookings=await seatBooking.aggregate([{$match:{movieId:new Types.ObjectId(movieId as string),forDate:new Types.ObjectId(forDate as string),time:time}},{
        $group:{
            _id:"$seatType",
            totalBooked:{$sum:"$fare"},
            totalBookings:{$sum:1}
            
          }
    }]);
    
        return res.status(200).json({success:true,details,totalBookings});
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Error"});
    }
}
const cancelBookings=async (req:Request,res:Response):Promise<any>=>{
  try { 
    const {paymentDetails,userId}=req.body;
    const parsedPaymentDetails=JSON.parse(paymentDetails);
    const cancelResults=await seatBooking.updateMany({bookedUser:new Types.ObjectId(userId),movieId:new Types.ObjectId(parsedPaymentDetails.movieId),forDate:new Types.ObjectId(parsedPaymentDetails.forDate),time:parsedPaymentDetails.time,order_id:parsedPaymentDetails.order_id,
        payment_id:parsedPaymentDetails.payment_id
    },{$set:{cancel:true}});
   if(!cancelResults) return res.status(400).json({success:false,mssg:"Something Went Wrong"});
   return res.status(200).json({success:true,mssg:"Cancel Request Accepted 😔"});
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
  }
}
export {getUserBookings,getBookDetailsForShow,cancelBookings};