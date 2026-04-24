import { Request,Response } from "express";
import showTime from "../models/showtime";
import seatBooking from "../models/seatBooking";
import { Types } from "mongoose";
import redis from "../redisConfig";
const checkValidQueryForPayment=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {forDate,movieId,time,selectedSeats,bookedUser}=req.body;
        const parseSelectedSeats=JSON.parse(selectedSeats);
        const findShowTime=await showTime.findById(forDate).populate("movieId");
        if(!findShowTime) return res.status(400).json({success:false,mssg:"Invalid Request"});
        let timeFound=-1;
        findShowTime.times.forEach((ele)=>{
            if(time===ele) timeFound=1;
 });
       if(timeFound===-1) return res.status(400).json({success:false,mssg:"Invalid Request"});
     const promisesRD=await Promise.all(
            parseSelectedSeats.map(async (seat:string)=>{
                 const key:string=`${movieId}-${forDate}-${time.split(" ")[0]}-${time.split(" ")[1]}-${seat}`;
                 const val:string|null=await redis.get(key);
                 if(val!==null && JSON.parse(val).userId===bookedUser){
                  return true;
    }
    else return false;
            })
        );
        
        if(promisesRD.includes(false)) return res.status(400).json({success:false,mssg:"Invalid Request"});
       const promisesDB= await Promise.all(
            parseSelectedSeats.map(async (seat:string)=>{
            const result=await seatBooking.findOne({forDate:new Types.ObjectId(forDate),movieId:new Types.ObjectId(movieId),seatNo:seat,time});
              if(result) return true;
               else return false;
            })
        );
      if(promisesDB.includes(true)){
         return res.status(400).json({success:false,mssg:"Invalid Request"})
      }
       
        return res.status(200).json({success:true,mssg:"Success",findShowTime});

    } catch (err) {
         console.log(err)
         return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}

const paymentSuccessInfo=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {userId,movieId,payment_id}=req.body;
      const result=await seatBooking.aggregate([{$match:{bookedUser:new Types.ObjectId(userId),payment_id:payment_id,movieId:new Types.ObjectId(movieId)}},{
            $group:{
                _id:{bookedUser:"$bookedUser",payment__id:"$payment_id"},
                seats:{$push:"$seatNo"},
                amountPaid:{$sum:"$fare"},
                doc:{$first:"$$ROOT"}
}
        },{$addFields:{"doc.seats":"$seats","doc.amountPaid":"$amountPaid"}},{
              $replaceRoot:{ newRoot:"$doc"  },
        },{
            $project:{seatNo:0,seatType:0,fare:0,__v:0}
        },{
            $lookup:{
                from:"movies",
                localField:"movieId",
                foreignField:"_id",
                as:"movie"
            }
        },{$unwind:"$movie"},
        {$project:{"movie.description":0,"movie.producedBy":0,"movie._id":0,"movie.director":0,"movie.dates":0,"movie.staffs":0,"movie.coverImage.publicId":0,"movie.createdAt":0,"movie.updatedAt":0,"movie.__v":0,}},{
            $lookup:{
                from:"showtimes",
                localField:"forDate",
                foreignField:"_id",
                as:"dates"
            }
        },{$unwind:"$dates"},{$project:{"dates._id":0,"dates.times":0,"dates.createdAt":0,"dates.updatedAt":0,"dates.__v":0}}]);
        if(result.length===0) return res.status(404).json({success:false,mssg:"Invalid Request"});
        return res.status(200).json({success:true,result});
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}

export {checkValidQueryForPayment,paymentSuccessInfo};